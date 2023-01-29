import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Select, { ActionMeta, InputActionMeta, SingleValue } from "react-select";
import axios from "axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Iframe from "react-iframe";
import { IFoodOption } from "../utils/types";

// TODO add readme
// https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/
// https://fdc.nal.usda.gov/api-key-signup.html
// TODO create new git and github repository
// TODO deploy to next.js

/**
 * Index page
 * @param props
 * @returns  jsx for Home page
 */
export default function IndexPage(props: { apikey: string }) {
  const [searchValue, setSearchValue] = useState("");
  const [foodOptions, setFoodOptions] = useState<IFoodOption[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>();
  const [fdcId, setFdcId] = useState(0);
  const router = useRouter();

  // www.joshwcomeau.com/react/the-perils-of-rehydration/
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  /**
   * Takes the input from the selectbox and then uses
   * axios to retrieve matching foods from the USDA database.
   * @param food
   * @returns
   */
  const performSearchRequest = async function foodSearch(food: string) {
    const { data } = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${props.apikey}&query=${food}`
    );
    return data;
  };

  /**
   * Takes an action based on what the user types
   * @param inputValue
   * @param InputActionMeta
   * @returns the previous input value or nothing
   */
  const onInputChange = (
    inputValue: string,
    { action, prevInputValue }: InputActionMeta
  ) => {
    // create a set to check for characters which cause
    // search to crash /\[]
    let characters = new Set(["/", "\\", "[", "]"]);
    if (characters.has(inputValue)) return;
    // Prevent clearing value on blur
    if (action !== "input-blur" && action !== "menu-close") {
      setSearchValue(inputValue);
      // user has typed a character inside text box
      if (action === "input-change") {
        // take input from text box to search for a food item
        handleSearch(inputValue);
      }
    }
    return prevInputValue;
  };

  /**
   * Checks if the user has clicked the check to clear the input
   * or when the has selected something.
   * @param selectedOption
   * @param param1
   */
  const onChange = (
    newValue: SingleValue<{ value: number; label: string }>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => {
    if (actionMeta.action === "clear") {
      setSearchValue("");
    }
    if (actionMeta.action === "select-option") {
      // user has selected something from drop down menu
      // grab fdcId here
      setFdcId(newValue!.value);
      // go to food detail page
      // this should happen when the user clicks mouse down
      // or after the user hits enter
      if (newValue) router.push(`/foodItem/${newValue.value}`);
    }
  };

  /**
   * Displays a message when no matching foods were found.
   * @param obj
   * @returns
   */
  const noOptionsMessage = (obj: { inputValue: string }) => {
    if (obj.inputValue.trim().length === 0) {
      return null;
    }
    return "No matching food items.";
  };

  /**
   * Sets loading to true. Uses searchQuery to perform search request.
   * If a sucessfull response occurs, add the food description to the label
   * and the fdcId number to the value of the options array of select box.
   * fdcId is the number the USDA food number assigns to a specific food item
   * @param searchQuery
   */
  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    let response = [];
    try {
      response = await performSearchRequest(searchQuery);
    } catch (e) {
      console.error(e);
    } finally {
      const options: { label: string; value: number }[] = [];
      response.foods.forEach((food: { description: string; fdcId: number }) => {
        options.push({
          label: food.description,
          value: food.fdcId,
        });
      });
      setFoodOptions(options);
      setIsLoading(false);
    }
  };

  /**
   * If user types a carriage return and there is a valid fdcId number,
   * go to the detail page for that food item.
   *
   * @param event
   */
  const onKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (fdcId > 0) {
        router.push(`/foodItem/${fdcId}`);
      }
    }
  };

  return (
    <Container>
      <Box
        sx={{
          my: 4,
          justifyContent: "center",
          alignItems: "center",
          mx: "auto",
          width: "50%",
        }}
      >
        <Typography variant='h6' sx={{ mb: 1 }}>
          Search for Nutrition Information
        </Typography>

        <Select
          theme={(theme) => ({
            ...theme,
            borderRadius: 3,
            colors: {
              ...theme.colors,
              primary: "#01579B",
            },
          })}
          inputValue={searchValue}
          onInputChange={onInputChange}
          isLoading={isLoading}
          defaultValue={{ value: 0, label: "Search for a food item..." }}
          onChange={onChange}
          options={foodOptions}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
          noOptionsMessage={noOptionsMessage}
          isClearable={true}
          onKeyDown={onKeyDown}
        />
      </Box>
      <Box
        sx={{
          my: 4,
          justifyContent: "center",
          alignItems: "center",
          mx: "auto",
          width: "50%",
        }}
      >
        <Iframe
          url='https://www.myplate.gov/widgets/myplate-plan-start/'
          scrolling='no'
          height='600px'
          width='100%'
        />
      </Box>
    </Container>
  );
}

/**
 * Fetches the data first before sending the page to the client
 * Take the api key defined in the .env file and assign it to apikey.
 * Since getStaticProps always runs on the server and never on the client,
 * API_KEY will not exposed.
 * @returns
 */
export function getStaticProps() {
  return {
    props: {
      apikey: process.env.API_KEY,
    },
  };
}
