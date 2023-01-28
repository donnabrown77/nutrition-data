import React from "react";
import axios from "axios";
import type { GetStaticProps, GetStaticPaths } from "next";
import { useQuery, QueryClient, dehydrate } from "react-query";
import { useRouter } from "next/router";
import FoodItemDetail from "../../components/FoodItemDetail";
import BrandedFoodItemDetail from "../../components/BrandedFoodItemDetail";
import { Nutrient, LabelNutrient, Portion } from "../../utils/types";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/**
 * Perform a search request for a specific food item using the USDA food database.
 * If an isSuccess repsonse is returned, test the value foodDetail.dataType. Based
 * on this value, setup either a Branded Food Item detail page or a Food Item detail page.
 * @param props
 * @returns Jsx for a detail page.
 */
export default function FoodDetail(props: { apikey: any }) {
  const router = useRouter();
  const foodItemID =
    typeof router.query?.id === "string" ? router.query.id : "";
  let portions: Portion[] = [];

  // format needs to be full not abridged
  // nutrient number parameters give detailed nutritional information
  // here is the link to documentation
  // https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FoodNutrient
  // There was not any documentation to expain which numbers correspond to which nutrition data
  // So I had to enter numbers manually to figure it out.
  // https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FDC/getFood
  const fetchFoodItemDetail = async (id: string) =>
    await axios
      .get(
        `https://api.nal.usda.gov/fdc/v1/food/${id}?format=full&nutrients=203&nutrients=204&nutrients=205&nutrients=206&nutrients=208&nutrients=211&nutrients=301&nutrients=302&nutrients=303&nutrients=304&nutrients=305&nutrients=306&nutrients=307&nutrients=308&nutrients=309&nutrients=310&nutrients=312&nutrients=313&nutrients=320&nutrients=323&nutrients=328&nutrients=401&nutrients=601&nutrients=606&nutrients=645nutrients=646&api_key=${props.apikey}`
      )
      .then(({ data }) => data);

  const {
    isSuccess,
    data: foodDetail,
    isLoading,
    isError,
  } = useQuery(
    // pass an id uniquely identify the item
    ["getFoodItem", foodItemID],
    () => fetchFoodItemDetail(foodItemID),
    {
      staleTime: 0,
      // make sure data is always fresh
      // https://backbencher.dev/articles/react-query-configure-query-stale-time
    }
  );

  if (isSuccess) {
    // foodDetail is the object which contains the nutritional data from the FDA's api
    const description: string = foodDetail.description;
    // There are five data types, Foundations Foods, SR Leagacy Foods, Survey Foods (FNDDS),
    // Branded Foods, and Experimental foods.
    // Each data returns different values, so extracting the data depends on the data type.
    if (foodDetail.dataType === "Experimental") {
      return (
        <div>
          Food type is experimental. No nutritional information is available.
        </div>
      );
    }
    if (foodDetail.dataType === "Branded") {
      // convert foodDetail.labelNutrients object to array of objects
      let entries = Object.entries(foodDetail.labelNutrients);
      // grab label nutrients from foodDetail
      const labelNutrients = entries.map((entry) => {
        let e: any = entry[1];
        let n: string = entry[0];
        let obj: LabelNutrient = { nutrient: n, value: e.value };
        return obj;
      });

      return (
        <div className='container'>
          <BrandedFoodItemDetail
            description={foodDetail.description}
            servingSize={foodDetail.householdServingFullText}
            ingredients={foodDetail.ingredients}
            labelNutrients={labelNutrients}
            foodItemID={foodItemID}
          />
        </div>
      );
    }

    // https://stackoverflow.com/questions/67811109/how-to-flatten-nested-objects-in-typescript
    // take elements of foodDetail.labelNutrients array by destructing nested array
    // and flatten these elements to a new array
    const foodNutrients: Nutrient[] = foodDetail.foodNutrients.map(
      ({ amount, id, nutrient: { name, unitName } }) => ({
        amount,
        id,
        name,
        unitName,
      })
    );

    //  grab portions for this food item
    if (foodDetail.dataType === "SR Legacy") {
      if (foodDetail.foodPortions) {
        portions = foodDetail.foodPortions.map(
          ({ gramWeight, amount, modifier }) => ({
            gramWeight,
            portionDescription: amount + " " + modifier,
          })
        );
      } else {
        portions[0] = {
          gramWeight: 100,
          portionDescription: "",
        };
      }
    } else if (foodDetail.dataType === "Foundation") {
      portions[0] = {
        gramWeight: 100,
        portionDescription: "",
      };
    } else {
      portions = foodDetail.foodPortions.map(
        ({ gramWeight, portionDescription }) => ({
          gramWeight,
          portionDescription: portionDescription,
        })
      );
    }

    return (
      <div className='container'>
        <FoodItemDetail
          description={description}
          nutrients={foodNutrients}
          portions={portions}
          foodItemID={foodItemID}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth='sm'>
        <Box
          sx={{
            my: 4,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant='subtitle1' className='center'>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth='sm'>
        <Box
          sx={{
            my: 4,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant='subtitle1' className='center'>
            We could not find your food item.
          </Typography>
        </Box>
      </Container>
    );
  }

  return <></>;
}

/**
 *  Pre-render a page at build time using the props returned
 *  from the functions
 * @param context
 * @returns apiKey, dehydrate queryClient
 */
export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  // dehydrate creates a frozen representation of a cache that can later
  // be hydrated with Hydrate, useHydrate, or hydrate.
  // This is useful for passing prefetched queries from server to client.
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      apikey: process.env.API_KEY,
    },
  };
};

// When exporting a function called getStaticPaths from a page
// that uses Dynamic Routes, Next.js will statically pre-render
// all the paths specified by getStaticPaths.
// If fallback is 'blocking', new paths not returned by getStaticPaths
// will wait for the HTML to be generated.
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
