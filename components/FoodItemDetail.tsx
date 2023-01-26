import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import LaunchIcon from "@mui/icons-material/Launch";
import Select from "react-select";

import { FoodDetailProps, Portion, Nutrient } from "../utils/types";
import percentDailyValue, {
  asteriksText,
} from "../utils/RecommendedDailyValues";
import fixNutrientName from "../utils/FixNutrientsNames";

// https://timmousk.com/blog/javascript-round-to-2-decimal-places/#:~:text=using%20the%20Math.-,round()%20function%3F,of%20this%20is%3A%2018.15%20console.

/**
 * Display data for the food item detail page.
 * @param description, nutrients, portions, foodItemID,
 * @returns jsx to display page
 */

const FoodItemDetail = ({
  description,
  nutrients,
  portions,
  foodItemID,
}: FoodDetailProps) => {
  // set value for default select box value to be first gramWeight in foodPortions array
  const [selectedValue, setSelectedValue] = useState(portions[0].gramWeight);
  const linkRef =
    "https://fdc.nal.usda.gov/fdc-app.html#/food-details/" +
    foodItemID +
    "/nutrients";

  function convertAmount(nutrientAmount: number, gramWeight: number) {
    const conversionFactor: number = gramWeight / 100;
    let convertedAmount =
      Math.round((nutrientAmount * conversionFactor + Number.EPSILON) * 100) /
      100;
    return convertedAmount;
  }

  const initialValues = nutrients.map((nutrient) => {
    // default portion size is 100 grams
    let convertedAmount = convertAmount(
      nutrient.amount,
      portions[0].gramWeight
    );
    return {
      amount: convertedAmount,
      id: nutrient.id,
      name: nutrient.name,
      unitName: nutrient.unitName,
    };
  });

  const [data, setData] = useState(initialValues);
  let options: { label: string; value: number }[] = [];

  const convertArrayForSelectBox = (portions: Portion[]) => {
    // clear options array because of bug with react-query
    // react-query fetches data from api twice
    // because of this food portions data is duplicated in the array
    // https://github.com/trojanowski/react-apollo-hooks/issues/36
    options = [];
    // create a set to check for duplicate gramWeight
    // api returns duplicate gramWights for some foodss
    let weight = new Set();
    portions.forEach(
      (portion: { gramWeight: number; portionDescription: string }) => {
        // display portion label when an exact quantity is specified
        // if gramWeight not in set, add gramWeight to set and continue
        if (!weight.has(portion.gramWeight)) {
          weight.add(portion.gramWeight);
          // For some reason, api sometimes returns Quantity not specified
          // even though there is a gram weight
          //  phrase makes no sense in this context so remove it.
          if (portion.portionDescription === "Quantity not specified") {
            portion.portionDescription = "";
          }
          options.push({
            label: portion.gramWeight + " grams " + portion.portionDescription,
            value: portion.gramWeight,
          });
        }
      }
    );
  };

  convertArrayForSelectBox(portions);
  // https://beta.reactjs.org/learn/updating-arrays-in-state#replacing-items-in-an-array

  // handle onChange event of the dropdown
  const handleChange = (e: any) => {
    setSelectedValue(e.value);
    // update array to display nutrient values based on portion amount

    const convertedData = nutrients.map((nutrient) => {
      let convertedAmount = convertAmount(nutrient.amount, e.value);
      return {
        amount: convertedAmount,
        id: nutrient.id,
        name: nutrient.name,
        unitName: nutrient.unitName,
      };
    });
    setData(convertedData);
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "10% 80% 10%",
          gridTemplateCols: "1fr 60% 1fr",
          my: 6,
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            mx: 2,
          }}
        >
          <Button
            sx={{
              mt: 0,
              mb: 3,
              textTransform: "none",
            }}
            variant='contained'
            href='/'
          >
            ← Back
          </Button>
          <Typography variant='h6'>{description}</Typography>
        </Box>

        <Box
          sx={{
            mx: 2,
            my: 3,
          }}
        >
          <Typography>Serving size:</Typography>
          <Select
            theme={(theme) => ({
              ...theme,
              borderRadius: 3,
              colors: {
                ...theme.colors,
                primary: "#01579B",
              },
            })}
            options={options}
            value={options.filter((option) => option.value === selectedValue)}
            onChange={handleChange}
          />

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: "33%" }}
              size='small'
              aria-label='nutrition data table'
            >
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>Nutrition Facts</TableCell>
                  <TableCell align='right'>% Daily Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((d: Nutrient) => {
                  d.name = fixNutrientName(d.name);
                  return (
                    <TableRow
                      key={d.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left'>{d.name}</TableCell>

                      <TableCell align='right'>
                        {d.amount}
                        {d.unitName}
                      </TableCell>
                      <TableCell align='right'>
                        {percentDailyValue(d.name, d.amount)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography
            variant='body2'
            sx={{
              mt: 1,
            }}
          >
            {asteriksText}
          </Typography>
        </Box>

        <Box
          sx={{
            mx: 2,
            mt: -1,
            mb: 4,
          }}
        >
          <Typography variant='body2'>Data source</Typography>
          <Typography variant='body2'>{description}</Typography>

          <Link href={linkRef}>
            USDA Food Data Central
            <LaunchIcon fontSize='inherit' />
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default FoodItemDetail;
