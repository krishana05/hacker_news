import React from "react";
import { render } from "@testing-library/react";
import { shallow } from "enzyme";
import App from "./App";

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// it("should add correctly", () => {
//   expect(1 + 1).toEqual(2);
// });
it("renders without crashing", () => {
  shallow(<App />);
});
it("should render correctly", () => {
  const { container } = render(<App />);
  expect(container.firstChild).toHaveClass("container");
});
it("should check the data", () => {
  const container = new App();
  console.log(container);
  expect(container.data).toEqual([]);
});
