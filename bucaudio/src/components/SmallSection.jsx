import { useEffect, useState } from "react";
import { AiFillPlayCircle, AiOutlineLoading } from "react-icons/ai";
import SongCard from "./SongCard";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { client } from "../api";
import { Link } from "react-router-dom";

const SmallSection = ({ title, endpoint }) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [error, setError] = useState(false);

	const fetchData = async () => {
		setError(false);
		setLoading(true);
		await client
			.get("/songs")
			.then((res) => {
				setData(res.data);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
		await client
			.get(`${endpoint}`, {
				baseURL: "https://www.kalkinso.com/api/",
				headers: {
					"X-Auth-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyMTIzMmM5OWEwZTJiZjY3YjAyZmY0In0sImlhdCI6MTczMjU2NDE0OCwiZXhwIjoxNzY0MTAwMTQ4fQ.1v97cro-REbcfHC18qQQ5Jh08ZMknDBvJGehfXO8wiE"
				}
			})
			.then((res) => {
				setTasks(res.data);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Box mt={8}>
			<Flex align="center" justify="space-between">
				<Flex align="center" gap={3}>
					<Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight={500}>
						{title}
					</Heading>
					<Box color="accent.main">
						<AiFillPlayCircle size={20} color="inherit" />
					</Box>
				</Flex>
				<Link to="/library">
					<Button
						variant="unstyled"
						fontSize={{ base: "sm", md: "md" }}
						color="accent.light"
						fontWeight={500}>
						See more
					</Button>
				</Link>
			</Flex>
			{loading ? (
				<Flex align="center" color="accent.main" justify="center" minH="20rem">
					<AiOutlineLoading color="inherit" className="spin" size={36} />
				</Flex>
			) : error ? (
				<Box my={2}>
					<Text>Sorry, an error occured</Text>
				</Box>
			) : (
				<Flex
					align="center"
					overflowX="scroll"
					gap={5}
					mt={3}
					pb={4}
					className="scrollbar_style">
					{data?.map((song, i) => (
						<SongCard key={song._id} song={song} task={tasks[i]} />
					))}
				</Flex>
			)}
		</Box>
	);
};

export default SmallSection;
