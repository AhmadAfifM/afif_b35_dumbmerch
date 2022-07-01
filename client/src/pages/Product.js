// import { useContext, useState, useEffect } from "react";
import { useState } from "react";
// import { useHistory } from "react-router-dom";
import Masonry from "react-masonry-css";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Dropdown,
  DropdownButton,
  FormControl,
} from "react-bootstrap";

// import { UserContext } from "../context/userContext";
import { useQuery } from "react-query";

import Navbar from "../components/Navbar";
import ProductCard from "../components/card/ProductCard";

import imgEmpty from "../assets/empty.svg";

// API config
import { API } from "../config/api";

export default function Product() {
  const title = "Shop";
  document.title = "DumbMerch | " + title;
  const [search, setSearch] = useState(null);
  const [searchKey, setSearchKey] = useState(null);
  //useQuery Take the queryKey for ex. productData as define
  let {
    data: products,
    isLoading,
    refetch,
  } = useQuery("productData", async () => {
    let url = "/products";

    if (search && searchKey) {
      url += `?searchKey=${searchKey}&search=${search}`;
    }

    const response = await API.get(url);
    return response.data.data;
  });

  console.log("THIS IS LOADING", isLoading);
  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  return (
    <div>
      <Navbar title={title} />
      <Container className="mt-5">
        <Row>
          <Col className="mb-1">
            <div className="text-header-product">Product</div>
          </Col>
        </Row>
        <Row>
          <Col xs="4" className="">
            <InputGroup className="mb-3">
              <DropdownButton
                variant="outline-secondary"
                title="Search by"
                id="input-group-dropdown-1"
                className="bg-success"
              >
                <Dropdown.Item onClick={() => setSearchKey("name")}>
                  Name
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSearchKey("sku")}>
                  SKU
                </Dropdown.Item>
              </DropdownButton>
              <FormControl
                aria-label="Text input with dropdown button"
                id="search"
                placeholder="Input"
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    refetch();
                  }
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          {products?.length !== 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {products?.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
            </Masonry>
          ) : (
            <Col>
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                  alt="empty"
                />
                <div className="mt-3">No data product</div>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
