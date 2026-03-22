import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SearchBar } from '../components/SearchBar';
import { productService } from '../services/productService';
import type { SearchSuggestionsResponse } from '../types';

vi.mock('../services/productService', () => ({
  productService: {
    searchSuggestions: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSuggestions: SearchSuggestionsResponse = {
  products: [
    {
      id: 'p1',
      name: 'Nike Mercurial',
      slug: 'nike-mercurial',
      image: 'https://img.com/boot.jpg',
      price: 89.99,
      salePrice: undefined,
      category: 'BOOTS',
    },
  ],
  categories: ['BOOTS'],
  brands: ['Nike'],
};

const emptySuggestions: SearchSuggestionsResponse = {
  products: [],
  categories: [],
  brands: [],
};

function renderSearchBar(onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <SearchBar onClose={onClose} />
    </MemoryRouter>
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(productService.searchSuggestions).mockResolvedValue(emptySuggestions);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders search input with placeholder', () => {
    renderSearchBar();
    expect(screen.getByPlaceholderText('Search products, brands...')).toBeInTheDocument();
  });

  it('does not call searchSuggestions for query shorter than 2 chars', async () => {
    renderSearchBar();
    await userEvent.type(screen.getByPlaceholderText('Search products, brands...'), 'n');
    vi.advanceTimersByTime(400);
    expect(productService.searchSuggestions).not.toHaveBeenCalled();
  });

  it('calls searchSuggestions after debounce when query is 2+ chars', async () => {
    renderSearchBar();
    await userEvent.type(screen.getByPlaceholderText('Search products, brands...'), 'ni');
    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(productService.searchSuggestions).toHaveBeenCalledWith('ni', expect.any(AbortSignal));
    });
  });

  it('shows product suggestions in dropdown', async () => {
    vi.mocked(productService.searchSuggestions).mockResolvedValue(mockSuggestions);
    renderSearchBar();
    await userEvent.type(screen.getByPlaceholderText('Search products, brands...'), 'ni');
    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(screen.getByText('Nike Mercurial')).toBeInTheDocument();
    });
  });

  it('shows "No results" message when all sections are empty', async () => {
    vi.mocked(productService.searchSuggestions).mockResolvedValue(emptySuggestions);
    renderSearchBar();
    await userEvent.type(screen.getByPlaceholderText('Search products, brands...'), 'zz');
    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(screen.getByText(/No results for/i)).toBeInTheDocument();
    });
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    renderSearchBar(onClose);
    const input = screen.getByPlaceholderText('Search products, brands...');
    await userEvent.type(input, 'ni');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clears input and closes dropdown on clear button click, does not call onClose', async () => {
    vi.mocked(productService.searchSuggestions).mockResolvedValue(mockSuggestions);
    const onClose = vi.fn();
    renderSearchBar(onClose);
    await userEvent.type(screen.getByPlaceholderText('Search products, brands...'), 'ni');
    vi.advanceTimersByTime(300);
    await waitFor(() => expect(screen.getByText('Nike Mercurial')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Clear search'));

    expect(screen.getByPlaceholderText('Search products, brands...')).toHaveValue('');
    expect(screen.queryByText('Nike Mercurial')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('navigates to /products?search on Enter key', async () => {
    const onClose = vi.fn();
    renderSearchBar(onClose);
    const input = screen.getByPlaceholderText('Search products, brands...');
    await userEvent.type(input, 'nike');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/products?search=nike');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
