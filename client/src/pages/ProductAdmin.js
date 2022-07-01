import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import ShowMoreText from "react-show-more-text";
import rupiahFormat from "rupiah-format";
import { useQuery, useMutation } from "react-query";

import NavbarAdmin from "../components/NavbarAdmin";
import DeleteData from "../components/modal/DeleteData";

import imgEmpty from "../assets/empty.svg";
import { API } from "../config/api";

export default function ProductAdmin() {
  let navigate = useNavigate();

  const title = "Product admin";
  document.title = "DumbMerch | " + title;

  // Create variabel for id product and confirm delete data with useState here ...
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Create init useState & function for handle show-hide modal confirm here ...
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState(null);
  const [searchKey, setSearchKey] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useQuery();
  let { data: products, refetch } = useQuery("productData", async () => {
    let url = "/products";

    if (search && searchKey) {
      url += `?searchKey=${searchKey}&search=${search}`;
    }

    const response = await API.get(url);
    return response.data.data;
  });

  const addProduct = () => {
    navigate("/add-product");
  };

  const handleDropdown = (type) => {};

  const handleUpdate = (id) => {
    navigate("/update-product/" + id);
  };

  // Create function handle get id product & show modal confirm delete data here ...
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  // Create function for handle delete product here ...
  // If confirm is true, execute delete data
  const deleteById = useMutation(async (id) => {
    try {
      await API.delete(`/product/${id}`);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  // Call function for handle close modal and execute delete data with useEffect here ...
  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById.mutate(idDelete);
      setConfirmDelete(false);
    }
  }, [confirmDelete]);

  return (
    <>
      <NavbarAdmin title={title} />

      <Container className="py-5">
        <Row>
          <Col xs="6">
            <div className="text-header-category mb-4">List Product</div>
          </Col>
          <Col xs="6" className="text-end">
            <Button
              onClick={addProduct}
              className="btn-dark"
              style={{ width: "100px" }}
            >
              Add
            </Button>
          </Col>
          <Col xs="4" className="mb-2">
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
          <Col xs="12">
            {products?.length !== 0 ? (
              <Table striped hover size="lg" variant="dark">
                <thead>
                  <tr>
                    <th width="1%" className="text-center">
                      No
                    </th>
                    <th>Photo</th>
                    <th>Product Name</th>
                    <th>Product Desc</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle">
                        <img
                          src={item.image}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                          alt={item.name}
                        />
                      </td>
                      <td className="align-middle">{item.name}</td>
                      <td className="align-middle">
                        <ShowMoreText
                          lines={1}
                          more="show"
                          less="hide"
                          className="content-css"
                          anchorClass="my-anchor-css-class"
                          expanded={false}
                          width={280}
                        >
                          {item.desc}
                        </ShowMoreText>
                      </td>
                      <td className="align-middle">{item.sku}</td>
                      <td className="align-middle">
                        {rupiahFormat.convert(item.price)}
                      </td>
                      <td className="align-middle">{item.qty}</td>
                      <td className="align-middle">
                        <tr>
                          <td>
                            <Button
                              onClick={() => {
                                handleUpdate(item.id);
                              }}
                              className="btn-sm btn-success-edit me-2"
                              style={{ width: "135px" }}
                            >
                              Edit
                            </Button>
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                handleDelete(item.id);
                              }}
                              className="btn-sm btn-danger-delete"
                              style={{ width: "135px" }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                  alt="empty"
                />
                <div className="mt-3">No data product</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </>
  );
}
