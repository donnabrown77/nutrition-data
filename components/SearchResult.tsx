import Link from "next/link";

/**
 *
 * @param foods
 * @returns jsx to display found foods as links or message
 * of no foods found.
 */
const SearchResult = ({ foods }: { foods: string[] }) => {
  return foods.length > 0 ? (
    <div className='search-grid'>
      {foods.map((food) => (
        <Link href={`/food/${food}`} key={food}>
          <div className='food-card'>{food}</div>
        </Link>
      ))}
    </div>
  ) : (
    <div className='search-message'> No foods found</div>
  );
};

export default SearchResult;
