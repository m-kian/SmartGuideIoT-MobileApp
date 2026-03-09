import { StyleSheet } from 'react-native';

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000', // black background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF0000', // red accent
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: '#111',
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#FF0000',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default authStyles;
