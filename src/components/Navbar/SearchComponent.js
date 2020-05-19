import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, connectHighlight, connectSearchBox, connectHits } from 'react-instantsearch-dom';
import { Link } from 'react-router-dom';

const searchClient = algoliasearch('ITIOOHLMEZ', '83b8e5f08d14efea5254d8d23b602f92');

const CustomHighlight = connectHighlight(({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit
  });

  return (

    <span>
      {parsedHit.map(
        part => part.isHighlighted ? <mark key={hit.title}>{part.value}</mark> : part.value
      )}
    </span>
  );
});

const Hit = ({ hit, refine }) => {
  const resetCurrentRefinement = () => refine('');
  
  return (
  <li>
    <Link to={`/p/${hit.postId}`} onClick={resetCurrentRefinement}>
      <CustomHighlight attribute='title' hit={hit} />
    </Link>
  </li>
  )
};

const Hits = ({ hits, refine }) => (
  <ul className='ais-Hits'>
    {hits.length === 0 ? (
      <span>There are no results</span>
    ) : (
      <>
        {hits.map((hit) => (
          <Hit key={hit.objectID} hit={hit} refine={refine}>
            {hit.title}
          </Hit>
        ))}
      </>
    )}
  </ul>
);

const CustomHits = connectHits(Hits);

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
  const onChange = (event) => {
    refine(event.currentTarget.value)
  };
  
  return (
  <>
    <form noValidate action='' role='search'>
      <input
        type='search'
        value={currentRefinement}
        onChange={onChange} 
        placeholder='Search...'
      />
    </form>
    { currentRefinement ? <CustomHits refine={refine} /> : null }
  </>
  )
};

const CustomSearchBox = connectSearchBox(SearchBox);

const SearchComponent = () => (
  <span className='search-component-container hidden-mobile'>
    <InstantSearch indexName='post_search' searchClient={searchClient}>
      <CustomSearchBox submit={false} />
    </InstantSearch>
  </span>
);

export default SearchComponent;