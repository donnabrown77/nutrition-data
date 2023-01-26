import React from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LaunchIcon from "@mui/icons-material/Launch";
import { LabelNutrient, BrandedFoodDetailProps } from "../utils/types";
import percentDailyValue, {
  asteriksText,
} from "../utils/RecommendedDailyValues";
import fixNutrientName from "../utils/FixNutrientsNames";

/**
 * Display data for the branded food item detail page.
 * @param description, servingSize, ingredients, labelNutrients, sfoodItemID,
 * @returns jsx to display page
 */
const BrandedFoodItemDetail = ({
  description,
  servingSize,
  ingredients,
  labelNutrients,
  foodItemID,
}: BrandedFoodDetailProps) => {
  // sort nutrients by name
  labelNutrients.sort((a, b) => (a.nutrient > b.nutrient ? 1 : -1));

  // setup a array of nutirents which contain unit names in grams
  let grams = ["carbohydrates", "fat", "fiber", "sugars", "protein"];
  let convertedServingSize = "";
  if (servingSize) {
    // convert text to mixed case
    convertedServingSize = servingSize.toLowerCase();
    // capitalize first letter
    // convertedServingSize = capitalizeFirstLetter(convertedServingSize);
  }

  const linkRef =
    "https://fdc.nal.usda.gov/fdc-app.html#/food-details/" +
    foodItemID +
    "/nutrients";

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "50% 50%",
          gridTemplateCols: "1fr 60% 1fr",

          justifyContent: "center",
          alignItems: "center",
          mx: "auto",
          width: "50%",
        }}
      >
        <Box
          sx={{
            mx: 2,
          }}
        >
          <Button
            sx={{
              textTransform: "none",
              mt: 0,
              mb: 3,
            }}
            variant='contained'
            href='/'
          >
            ← Back
          </Button>

          <Typography variant='h6'>
            {description} - {convertedServingSize}
          </Typography>
          <Typography variant='body1'>{ingredients.toLowerCase()}</Typography>
        </Box>
        <Box
          sx={{
            mx: 2,
            my: 3,
          }}
        >
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: "33%", my: 2 }}
              size='small'
              aria-label='nutrition data table'
            >
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>Nutrition Facts</TableCell>
                  <TableCell align='right'>% Daily Value *</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labelNutrients.map((labelNutrient: LabelNutrient, index) => {
                  labelNutrient.nutrient = fixNutrientName(
                    labelNutrient.nutrient
                  );
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left'>
                        {labelNutrient.nutrient}
                      </TableCell>
                      <TableCell align='right'>
                        {labelNutrient.value}
                        {grams.includes(labelNutrient.nutrient)
                          ? (labelNutrient.unitName = "g")
                          : labelNutrient.nutrient === "calories"
                          ? (labelNutrient.unitName = " ")
                          : (labelNutrient.unitName = "mg")}
                      </TableCell>

                      <TableCell align='right'>
                        {percentDailyValue(
                          labelNutrient.nutrient,
                          labelNutrient.value
                        )}
                        %
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

          <Typography
            variant='body2'
            sx={{
              mt: 5,
            }}
          >
            Data source
          </Typography>
          <Typography variant='body2'>{description}</Typography>
          {/* had to inline style because I could not figure out to style with Material UI */}
          <Link style={{ color: "#01579B" }} href={linkRef}>
            USDA Food Data Central
            <LaunchIcon fontSize='inherit' />
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default BrandedFoodItemDetail;
