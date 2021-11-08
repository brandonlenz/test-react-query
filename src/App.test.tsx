import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it("Renders children", () => {
    const { queryByTestId } = render(<App />);
  
    const personDiv = queryByTestId('person-container')
  
    expect(personDiv).toBeInTheDocument();
  })
});
