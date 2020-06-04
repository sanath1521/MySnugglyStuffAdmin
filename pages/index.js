import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';
import Moment from 'moment';

// export const apiUrl = "https://powerful-shelf-65832.herokuapp.com";
export const apiUrl = "https://dry-reaches-17824.herokuapp.com";



// export const apiUrl = "http://192.168.1.104:5000";

export default function Home() {

  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [order, setOrder] = useState({});

  const getOrders = () => {
    axios.get(`${apiUrl}/orders`)
    .then(res => {
      console.log(res);
      if(res.data.status == 200){
        setOrders(res.data.orders.reverse());
      }
    })
    .catch(e => {
      console.log('Server error');
      console.log(e);
    })
  }

  useEffect(() => {
    getOrders();
  }, []);


  useEffect(() => {
    if(order._id){
      setShowForm(true);
    }
    else if(order == ''){
      setShowForm(false);
    }
  }, [order])

  const updateOrderStatus = (status) => {
    let data = {
      userId: order.user.id,
      orderId: order._id,
      status
    }

    axios.post(`${apiUrl}/orders/updateStatus`, data, { timeout: 10000 })
    .then(res => {
      if(res.data.status == 200){
        getOrders();
        setShowForm(false);
        alert('Order Updated successfully');
        setOrder('');
      }
      else{
        alert('An error occured at the server');
      }
    })
    .catch(e => {
      alert("An error occured at the server");
    })
  }


  return (
    <div className="container">
      {showForm && (
        <>
          <div className="overlay"></div>
          <div className="form">
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "15px",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "20px",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowForm(false);
                setOrder("");
              }}
            >
              <div>
                <div
                  style={{
                    width: "20px",
                    borderWidth: "10px",
                    height: "1px",
                    backgroundColor: "#000",
                    transform: "rotate(45deg)",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    width: "20px",
                    borderWidth: "10px",
                    height: "1px",
                    backgroundColor: "#000",
                    transform: "rotate(-45deg)",
                    marginRight: "20px",
                  }}
                ></div>
              </div>
            </div>
            <div style={{ height: "90%", overflowY: "auto", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ flex: 1, height: "200px" }}>
                  <h4>Shipping Address</h4>
                  <p style={{ width: "60%" }}>{order.address.userName}</p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.town}, {order.address.city},{" "}
                    {order.address.city}, {order.address.zipcode}
                  </p>
                  <p></p>
                  {/* <p>{order.address.zipcode}</p> */}
                  <p>{order.address.phone}</p>
                </div>
                <div style={{ flex: 1, height: "200px" }}>
                  <h4>User Details</h4>
                  <p>{order.user.name}</p>
                  <p>{order.user.phone}</p>
                  <p>{order.user.email}</p>
                </div>
                <div style={{ flex: 1, marginLeft: "30px", height: "200px" }}>
                  <h4>Price Details</h4>
                  <p>Items Price: ${order.price.totalPrice}</p>
                  <p>Taxes: ${order.price.tax}</p>
                  <p>Delivery Charges: ${order.price.deliveryCharge}</p>
                </div>
              </div>
              <h4>Items({order.items.length})</h4>
              <div className="formItems">
                {order.items.map((el, i) => (
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "50px",
                      width: "100%",
                      alignItems: "center",
                      // justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", flex: 1 }}>
                      <img
                        src={el.imageUrl}
                        style={{ height: "200px", width: "200px" }}
                      />
                      <div style={{ marginLeft: "20px" }}>
                        <p>{el.name}</p>
                        <p style={{ textTransform: "capitalize" }}>
                          Size: {el.size}
                        </p>
                        <p>Quantity: {el.quantity}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flex: 1 }}>
                      <img
                        src={el.logo.imageUrl}
                        style={{ height: "200px", width: "200px" }}
                      />
                      <div style={{ marginLeft: "20px" }}>
                        <p>logo Text: {el.logo.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                height: "10%",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div style={{ width: "50%", marginTop: "10px" }}>
                <p>Id: {order._id}</p>
                <p style={{ textTransform: "capitalize", fontWeight: "500" }}>
                  Status: {order.status}
                </p>
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
                {order.status == "received" && (
                  <>
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
                        cursor: "pointer",
                        fontSize: "15px",
                      }}
                      onClick={() => updateOrderStatus("cancelled")}
                    >
                      Cancel Order
                    </button>
                    <button
                      style={{
                        marginRight: "20px",
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "10px 20px 10px 20px",
                        outline: "none",
                        textAlign: "center",
                        cursor: "pointer",
                        border: "none",
                        fontSize: "15px",
                      }}
                      onClick={() => updateOrderStatus("confirmed")}
                    >
                      Confirm Order
                    </button>
                  </>
                )}
                {order.status == "confirmed" && (
                  <button
                    style={{
                      marginRight: "20px",
                      backgroundColor: "#000",
                      color: "#fff",
                      padding: "10px 20px 10px 20px",
                      outline: "none",
                      textAlign: "center",
                      cursor: "pointer",
                      border: "none",
                      fontSize: "15px",
                    }}
                    onClick={() => updateOrderStatus("shipped")}
                  >
                    Ship Order
                  </button>
                )}
                {order.status == "shipped" && (
                  <button
                    style={{
                      marginRight: "20px",
                      backgroundColor: "#000",
                      color: "#fff",
                      padding: "10px 20px 10px 20px",
                      outline: "none",
                      textAlign: "center",
                      cursor: "pointer",
                      border: "none",
                      fontSize: "15px",
                    }}
                    onClick={() => updateOrderStatus("delivered")}
                  >
                    Order Delivered
                  </button>
                )}
              </div>
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
            <button className="button" onClick={() => getOrders()}>
              Refresh
            </button>
          </div>

          <div style={{ marginBottom: '50px' }}>
            <table>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>No of Items</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
              {orders.map((el, i) => (
                <tr onClick={() => setOrder(el)} style={{ cursor: "pointer" }}>
                  <td>{el._id}</td>
                  <td>{el.user.name}</td>
                  <td>{el.items.length}</td>
                  <td>
                    $
                    {el.price.totalPrice +
                      el.price.tax +
                      el.price.deliveryCharge}
                  </td>
                  <td>{Moment(el.createdOn).format("MMM DD YYYY")}</td>
                  <td style={{ textTransform: "capitalize" }}>{el.status}</td>
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
          left: 13%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: absolute;
          z-index: 10;
          background-color: white;
          opacity: 1;
          height: 80%;
          width: 75%;
          padding: 50px;
        }

        .input: {
          paddingvertical: 20px;
          color: red;
          marginleft: 20px;
          background-color: #c4c4c4;
        }

        .formtop: {
          display: flex;
          // width: 100%;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        }

        .formItems {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 100%;
          justify-content: space-between;
        }

        .formItem {
          // flex: 1;
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
          border-right: 1px solid #c4c4c4;
          border-bottom: 1px solid #c4c4c4;
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
