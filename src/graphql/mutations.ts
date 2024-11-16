import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($request: LoginRequest!) {
    login(request: $request) {
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($request: RegisterRequest!) {
    register(request: $request) {
      token
    }
  }
`;

export const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      fullName
      email
      phoneNumber
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation Update($id: ID!, $fullName: String!, $phoneNumber: String!) {
    updateUser(request: { id: $id, fullName: $fullName, phoneNumber: $phoneNumber }) {
      id
    }
  }
`;



export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      fullName
      email
      role
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: Role!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;