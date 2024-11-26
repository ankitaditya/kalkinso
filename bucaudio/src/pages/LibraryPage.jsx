import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import { AiOutlineLoading } from "react-icons/ai";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { client } from "../api";

const LibraryPage = () => {
	const [songs, setSongs] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [ taskLoading, setTaskLoading] = useState(true);
	const [error, setError] = useState(false);

	const fetchSongs = async () => {
		setLoading(true);
		setError(false);
		await client
			.get("/songs")
			.then((res) => {
				setSongs(res.data);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	};

	const fetchTasks = async () => {
		setLoading(true);
		setTaskLoading(true);
		setError(false);
		await client
			.get("/tasks/parent", {
				baseURL: "https://www.kalkinso.com/api/",
				headers: {
					'X-Auth-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyMTIzMmM5OWEwZTJiZjY3YjAyZmY0In0sImlhdCI6MTczMjU2NDE0OCwiZXhwIjoxNzY0MTAwMTQ4fQ.1v97cro-REbcfHC18qQQ5Jh08ZMknDBvJGehfXO8wiE'
				}
			})
			.then((res) => {
				setTasks(res.data);
				setSongs(res.data);
				setTaskLoading(false);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
				setTaskLoading(false);
			});
	};

	useEffect(() => {
		fetchSongs();
		fetchTasks();
	}, []);

	return (
		<Box
			p={6}
			pb={32}
			pt={{ base: 20, md: 6 }}
			pl={{ base: 4, md: 14, xl: 0 }}
			minH="100vh">
			<Box mb={6}>
				<Heading
					fontSize={{ base: "lg", md: "2xl" }}
					fontWeight="semibold"
					mb={{ base: 1, md: 3 }}>
					Audio Book Library
				</Heading>
				<Text fontSize="sm" color="zinc.400">
					Discover interesting Audio Books
				</Text>
			</Box>
			{(loading || taskLoading) && (tasks.length < 1 || songs.length < 1) && (
				<Flex align="center" justify="center" color="accent.main" minH="20rem">
					<AiOutlineLoading className="spin" size={36} />
				</Flex>
			)}
			<Grid
				templateColumns={{
					base: "repeat(2, 1fr)",
					md: "repeat(3, 1fr)",
					lg: "repeat(4, 1fr)",
					xl: "repeat(5, 1fr)",
				}}
				gap={{ base: 3, md: 6 }}>
				{songs.map((song, index) => (
					tasks[index]?<SongCard key={song._id} song={song} task={tasks[index]} />:<></>
				))}
			</Grid>
			{error && !taskLoading && (
				<Box>
					<Text>Sorry, an error occured</Text>
				</Box>
			)}
		</Box>
	);
};

export default LibraryPage;
