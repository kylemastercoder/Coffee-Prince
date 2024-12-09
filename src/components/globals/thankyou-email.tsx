/* eslint-disable react/no-unescaped-entities */
import { CartItem } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  render,
} from "@react-email/components";
import * as React from "react";

interface NotifyEmailProps {
  name: string;
  orderNumber: string;
  orderDate: string;
  items: CartItem[];
  totalPrice: number;
}

export const ReceiptEmail = ({
  name,
  orderNumber,
  orderDate,
  items,
  totalPrice
}: NotifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Get your order summary and more</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={track.container}>
          <Row>
            <Column>
              <Text style={global.paragraphWithBold}>Order Number</Text>
              <Text style={track.number}>{orderNumber}</Text>
            </Column>
          </Row>
        </Section>
        <Hr style={global.hr} />
        <Section style={message}>
          <Img
            src={
              "https://firebasestorage.googleapis.com/v0/b/tander-mobile.appspot.com/o/cflogo.png?alt=media&token=1ff7fb41-7506-4238-b2ae-ad771c167b18"
            }
            width="100"
            height="100"
            alt="Coffee Prince"
            style={{ margin: "auto" }}
          />
          <Heading style={global.heading}>Your order is processing.</Heading>
          <Text style={global.text}>
            You order is processing. We´ll send you an email when your order is
            completed.
          </Text>
          <Text style={{ ...global.text, marginTop: 24 }}>
            Thank you for ordering with us. We appreciate your business. If you
            have any questions, please contact us at 0977 777 7174.
          </Text>
        </Section>
        <Hr style={global.hr} />
        <Section style={global.defaultPadding}>
          {items.map((item, index) => (
            <Row style={{marginBottom: "10px"}} key={index}>
              <Column>
                <Img src={item.image} alt="Menu" style={{ width: "100px" }} />
              </Column>
              <Column style={{ verticalAlign: "top", paddingLeft: "12px" }}>
                <Text style={{ ...paragraph, fontWeight: "500" }}>
                  {item.name}
                </Text>
                <Text style={global.text}>{item.variant} ({item.price})</Text>
                <Text style={global.text}>Quantity: {item.quantity}</Text>
              </Column>
            </Row>
          ))}
        </Section>
        <Hr style={global.hr} />
        <Section style={global.defaultPadding}>
          <Text style={adressTitle}>Order by: {name}</Text>
          <Text style={{ ...global.text, fontSize: 14 }}>
            D5J's Building, 2nd Floor, 51 Don P. Campos Avenue, Brgy. Zone II,
            City of Dasmariñas, Cavite, Dasmariñas, Philippines
          </Text>
        </Section>
        <Hr style={global.hr} />
        <Section style={global.defaultPadding}>
          <Row style={{ display: "inline-flex", marginBottom: 40 }}>
            <Column style={{ width: "170px" }}>
              <Text style={global.paragraphWithBold}>Total Price</Text>
              <Text style={track.number}>
                {formatPrice(totalPrice)} {/* Sum of all items' prices */}
              </Text>
            </Column>
            <Column>
              <Text style={global.paragraphWithBold}>Order Date</Text>
              <Text style={track.number}>{orderDate}</Text>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const NotifyEmailHTML = (props: NotifyEmailProps) =>
  render(<ReceiptEmail {...props} />, {
    pretty: true,
  });

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "220px",
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    color: "#000",
  } as React.CSSProperties,
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const track = {
  container: {
    padding: "22px 40px",
    backgroundColor: "#F7F7F7",
  },
  number: {
    margin: "12px 0 0 0",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#6F6F6F",
  },
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;

const adressTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};
