import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// organisms
import TestCard from '../organisms/TestCard';

const ListWrapper = styled.section`
  width: 100%;
  margin: 0 auto;
  margin-top: 20px;
  z-index: 1;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 1rem;
  background: #fafafa;
  gap: 0.5rem;
`;

const PageNumber = styled.span`
  margin: 0 5px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  text-align: center;
  display: inline-block;
  color: ${props => (props.active ? '#0f3850' : 'black')};
  &:hover {
    background-color: #f0f0f0;
  }
`;

const List = ({ tests, settings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed

  const onlyText =
    !settings.refImage && !settings.testImage && !settings.diffImage;

    useEffect(() => {
      setCurrentPage(1);
    }, [tests]);

  // Calculate index range based on current page and items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, tests.length);

  // Slice tests array based on calculated index range
  const paginatedTests = tests.slice(startIndex, endIndex);

  // Handle click on page number
  const handleClick = pageNumber => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(tests.length / itemsPerPage);

  return (
    <>
      <ListWrapper>
        {paginatedTests.map((test, i) => (
          <TestCard
            id={`test${startIndex + i}`} // Use unique IDs
            numId={startIndex + i} // Use numId to maintain consistency
            test={test}
            key={startIndex + i} // Use key based on index in paginatedTests
            lastId={startIndex + paginatedTests.length - 1} // Calculate lastId based on paginatedTests length
            onlyText={onlyText}
          />
        ))}
      </ListWrapper>
      <PaginationContainer>
        {[...Array(totalPages)].map((_, index) => (
          <PageNumber
            key={index}
            active={index + 1 === currentPage}
            onClick={() => handleClick(index + 1)}
          >
            {index + 1}
          </PageNumber>
        ))}
      </PaginationContainer>
    </>
  );
};

const mapStateToProps = state => {
  return {
    tests: state.tests.filtered,
    settings: state.layoutSettings
  };
};

const ListContainer = connect(mapStateToProps)(List);

export default ListContainer;
