import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import Select from "react-select";

// export const apiUrl = "https://powerful-shelf-65832.herokuapp.com";

export const apiUrl = "https://dry-reaches-17824.herokuapp.com";
// export const apiUrl = "http://192.168.1.104:5000";



export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState('');
  const [cats, setCats] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [imgBase64, setImgBase54] = useState("");

  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSizes, setSelectedSizes]  = useState(null);


  const getProducts = () => {
    axios.get(`${apiUrl}/products`)
    .then((res) => {
      console.log(res);
      if (res.data && res.data.length > 0) {
        setProducts(res.data);
      }
    })
    .catch(e => {
        console.log(e);
    })
  };

  const getCategories = () => {
    axios
      .get(`${apiUrl}/categories`)
      .then((res) => {
        console.log(res);
        if (res.data && res.data.length > 0) {
          let data = [];
          res.data.forEach(el => {
            data.push({
                label: el.name,
                value: el._id
            });
          })

          setCats(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);



  const handleImageUpload = (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = function () {
      let base64Img = reader.result.replace(/^data:image\/\w+;base64,/, "");
      console.log(base64Img);
      setImgBase54(base64Img);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitClick = () => {
    

    if (name == "") {
      alert("Enter a valid name");
      return;
    }

    if (price == "") {
      alert("Please enter price");
      return;
    }

    if (!selectedCat) {
      alert("Please select a category");
      return;
    }

    if(!selectedSizes){
        alert("Please select sizes");
        return;
    }
      

    if (imgBase64 == "") {
      alert("Upload an image");
      return;
    }

    

    let data = {
      name,
      description,
      price: Number(price),
      imageBase64: imgBase64,
      category: selectedCat.label,
      categoryId: selectedCat.value
    };

    let sizes = [];

    sizeOptions.forEach(el => {
       for(let i=0; i<selectedSizes.length; i++){
           if(selectedSizes[i].label == el.label){
               sizes.push({
                   label: el.value,
                   quantity: 5
               })
           }
       }
    })

    console.log(sizes);
    data.sizes = sizes;

    console.log(data);
    axios.post(`${apiUrl}/products/addProduct`, data, { timeout: 15000 })
    .then((res) => {
      if (res.data.status == 200) {
        setShowForm(false);
        alert("Product created successfully");
        getProducts();
        resetForm();
      }
    })
    .catch(e => {
        alert('Sorry an error occured at the server.');
    })
  };


  const resetForm = () => {
      setName('');
      setDescription("");
      setPrice("");
      setImgBase54("");
  }

  const handleDeleteClick = (id) => {
    const choice = confirm("Are you sure you want to delete this?");
    let data = {
      id,
    };
    if (choice) {
      axios
        .post(`${apiUrl}/products/delete`, data, { timeout: 10000 })
        .then((res) => {
          alert("Product deleted successfully.");
          getProducts();
        })
        .catch((e) => {
          alert("Sorry an error occured");
        });
    }
  };
  const sizeOptions = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
  ];


  return (
    <div className="container">
      {showForm && (
        <>
          <div className="overlay"></div>
          <div className="form">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "15px",
                width: "100%",
              }}
            >
              <p>Name:</p>
              <input
                name="name"
                value={name}
                placeholder="Enter here"
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "60%",
                  marginLeft: "60px",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingRight: "50px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "15px",
                width: "100%",
              }}
            >
              <p>Description:</p>
              <input
                type="text"
                name="desc"
                value={description}
                placeholder="Enter here"
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "60%",
                  marginLeft: "20px",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingRight: "50px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "15px",
                width: "100%",
              }}
            >
              <p>Price:</p>
              <input
                type="text"
                name="desc"
                value={price}
                placeholder="Enter here"
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  width: "60%",
                  marginLeft: "65px",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingRight: "50px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "30px",
              }}
            >
              <p>Category:</p>
              <div style={{ width: "60%", marginLeft: "35px" }}>
                <Select
                  options={cats}
                  style={{ marginLeft: "30px" }}
                  onChange={(op) => setSelectedCat(op)}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "30px",
              }}
            >
              <p>Sizes:</p>
              <div style={{ width: "60%", marginLeft: "65px" }}>
                <Select
                  options={sizeOptions}
                  isMulti
                  onChange={(op) => setSelectedSizes(op)}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p>Upload image:</p>
              <input
                type="file"
                name="myImage"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                style={{ marginLeft: "20px" }}
              />
            </div>

            <div
              style={{
                width: "100%",
                marginTop: "40px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  marginRight: "20px",
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid black",
                  padding: "10px 20px 10px 20px",
                  outline: "none",
                  textAlign: "center",
                  // border: "none",
                  fontSize: "15px",
                }}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  marginRight: "20px",
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "10px 20px 10px 20px",
                  outline: "none",
                  textAlign: "center",
                  border: "none",
                  fontSize: "15px",
                }}
                onClick={() => handleSubmitClick()}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
      <div className="sidebar">
        <div className="tab">
          <Link href="/">
            <div className="tabtextdiv">
              <h3 className="tabtext">Orders</h3>
              <p className="tabtext">Check your orders here</p>
            </div>
          </Link>
        </div>
        <div className="tab">
          <Link href="/categories">
            <div className="tabtextdiv">
              <h3 className="tabtext">Categories</h3>
              <p className="tabtext"> Check your categories here</p>
            </div>
          </Link>
        </div>
        <div className="tab">
          <Link href="/products">
            <div className="tabtextdiv">
              <h3 className="tabtext">Products</h3>
              <p className="tabtext">Check your products here</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="main">
        <div className="topbar"></div>
        <div className="view">
          <div className="buttonContainer">
            <button className="button" onClick={() => setShowForm(true)}>
              Add Product
            </button>
          </div>

          <div>
            <table>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Available sizes</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
              {products.map((el, i) => (
                <tr>
                  <td>{el.name}</td>
                  <td>{el.category}</td>
                  <td style={{ textTransform: "uppercase" }}>
                    {el.sizes.map((x) => x.label + " ")}
                  </td>
                  <td>$ {el.price}</td>
                  <td
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleDeleteClick(el._id)}
                  >
                    Delete
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          // padding: 0 0.5rem;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
        }

        .overlay {
          height: 100vh;
          width: 100vw;
          background-color: black;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0.8;
        }

        .form {
          top: 10%;
          left: 20%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: absolute;
          z-index: 10;
          background-color: white;
          opacity: 1;
          height: 80%;
          width: 60%;
          padding: 50px;
        }

        .input: {
          paddingvertical: 20px;
          width: 70
          color: red;
          marginleft: 20px;
          background-color: #c4c4c4;
        }

        .sidebar {
          // padding-top: 50px;
          height: 100vh;
          // background-color: #c4c4c4;
          width: 20vw;
          dispaly: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-end;
        }

        .tab {
          border-bottom: 1px solid #c4c4c4;
          border-right: 1px solid #c4c4c4;
          height: 33.33%;
          display: flex;
          flex-direction: column;
          align-items: center;

          // padding-top: 20;
          justify-content: center;
        }

        .tabtextdiv {
          cursor: pointer;
        }

        .tabtext {
          text-align: center;
        }

        .main {
          height: 100vh;
          backgorund-color: green;
          width: 80vw;
        }

        .topbar {
          height: 10%;
          background-color: #d5d5d5;
        }

        table {
          border-collapse: collapse;
          margin-left: 10%;
          margin-top: 5%;
          border-radius: 10rem;
          width: 80%;
          // font-family: DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        td,
        th {
          border: 1px solid #dddddd;

          text-align: left;
          padding: 15px;
        }

        .view {
          height: 90%;
          overflow-y: auto;
          marginbottom: 50px;
        }
        .buttonContainer {
          margin-top: 30px;
          margin-right: 30px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }

        .button {
          background-color: #000; /* Green */
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
        }
        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
