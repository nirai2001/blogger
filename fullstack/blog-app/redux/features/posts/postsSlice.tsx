import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Define the type for our post
export interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

// Define interface for the Posts state
interface PostsState {
  posts: Post[];
  post: Post | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: PostsState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: Omit<Post, '_id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, postData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }: { id: string; postData: Partial<Post> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/posts/${id}`, postData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/posts/${id}`);
      return id; // Return the id so we can remove it from the state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

// Create the posts slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.post = null;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.post = action.payload;
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Create a new post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts.unshift(action.payload); // Add the new post at the beginning
        state.post = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
    // Update a post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts = state.posts.map(post => 
          post._id === action.payload._id ? action.payload : post
        );
        state.post = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
    // Delete a post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
        state.error = null;
        state.success = true;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetPostState, clearError } = postsSlice.actions;

export default postsSlice.reducer;