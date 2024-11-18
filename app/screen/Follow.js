import { gql, useMutation } from "@apollo/client";
import { Alert } from "react-native";

const FOLLOW_USER = gql`mutation FollowUser($followingId: ID!) {
  followUser( followingId: $followingId) 
}`;



export const useFollowUser = () => {
  const [followUser, { loading, error, data }] = useMutation(FOLLOW_USER, {
    refetchQueries: ['userProfile'],
  });  

  const handleFollow = async (userId) => {
    try {
      const response = await followUser({ variables: { followingId: userId } });
      console.log(response);
      Alert.alert("Success", "User followed successfully!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message || "An error occurred while following the user.");
    }
  };

  return { handleFollow, loading, error, data };
};