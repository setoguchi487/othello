import { render, screen } from '@testing-library/react';
import othello from './othello';

test('renders learn react link', () => {
  render(<othello />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
