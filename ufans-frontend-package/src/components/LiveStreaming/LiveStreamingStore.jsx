import React, { useState } from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  Image,
  Media,
} from "react-bootstrap";
import "./LiveStreaming.css";
import { Link } from "react-router-dom";
import LiveStreamingProductCard from "./LiveStreamingProductCard";

const LiveStreamingStore = (props) => {
  return (
    <>
      {props.products.length > 0 ? (
        <div className="live-streaming-store-product-card">
          <div className="live-streaming-store-product-header">
            <h4 className="text-uppercase">{props.displayName}’S STORE</h4>
            <Link to={`/${props.userUniqueId}`}>View All</Link>
          </div>
          <div className="live-streaming-store-product-box">
            {props.products.map((product, i) => (
              <>
                <LiveStreamingProductCard
                  product={product}
                  key={i}
                />
              </>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LiveStreamingStore;
