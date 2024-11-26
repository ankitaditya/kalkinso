import {
	Box,
	Button,
	Flex,
	Heading,
	Image,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fadeInUp } from "../theme/motionVariants";
import {
	setCurrentTrack,
	setPlaying,
	setTrackList,
} from "../redux/slices/playerSlice";
import {
	AiFillHeart,
	AiFillPauseCircle,
	AiFillPlayCircle,
	AiOutlineHeart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { client } from "../api";
import { setUser } from "../redux/slices/userSlice";
import axios from "axios";
import metadata from "audio-metadata";

const fetchAudioMetadata = async (signedUrl) => {
    try {
      // Fetch the audio file as a binary buffer
      const response = await axios.get(signedUrl, {
        responseType: "arraybuffer", // Get the audio file as a buffer
      });

      const audioBuffer = Buffer.from(response.data); // Convert to Node.js Buffer
      const meta = metadata.parse(audioBuffer, { duration: true }); // Parse metadata

      if (meta && meta.duration) {
        return meta.duration;
      } else {
        return 0;
      }
    } catch (err) {
      return 0;
    }
  };

const getAudioUrl = async (task) => {
	let urls = task?.filter((t) => t.id.includes('.mp3')|t.id.includes('.aac')|t.id.includes('.m4a')).map((t) => t.signedUrl);
	if(urls.length === 0) return null;
	let duration = await fetchAudioMetadata(urls[0]);
	return {audioUrl:urls[0], duration:getTime(duration)};
};

const getTime = (duration) => {
	if(Math.floor(duration / 60)>60){
		return `${Math.floor(duration / 3600)}.${Math.floor(Math.floor(duration % 3600) / 60)}.${Math.floor(Math.floor(duration % 3600) % 60)}`
	}
};

const SongCard = ({ song, task }) => {
	const dispatch = useDispatch();
	const { currentTrack, isPlaying } = useSelector((state) => state.player);
	const { user, token } = useSelector((state) => state.user);

	const toast = useToast();

	const playSong = () => {
		client.
			post(`/kits`, {
				bucketName: "kalkinso.com",
				Prefix: `users/${task?.user?._id}/tasks/${task._id}/`,
			}, {
				baseURL: "https://www.kalkinso.com/api/",
				headers: {
					'X-Auth-Token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyMTIzMmM5OWEwZTJiZjY3YjAyZmY0In0sImlhdCI6MTczMjU2NDE0OCwiZXhwIjoxNzY0MTAwMTQ4fQ.1v97cro-REbcfHC18qQQ5Jh08ZMknDBvJGehfXO8wiE",
				}
			}).then((res) => {
				getAudioUrl(res.data?.entries[0]?.children?.entries).then(({audioUrl, duration}) => {
					let newSong = {...song, org: task?.org, coverImage: task.thumbnail?task.thumbnail:task?.user?.avatar, title: task.name, songUrl: audioUrl, duration: duration};
					dispatch(setCurrentTrack(newSong));
					dispatch(setTrackList({ list: [newSong] }));
					dispatch(setPlaying(true));
				});
			}).catch((err) => {});
	};

	const handleLike = async () => {
		await client
			.patch(`/songs/like/${song?._id}`, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				dispatch(setUser(res.data));
				toast({
					description: "Your favorites have been updated",
					status: "success",
				});
			})
			.catch(() => {
				toast({
					description: "An error occured",
					status: "error",
				});
			});
	};

	const isCurrentTrack = currentTrack?._id === song?._id;
	const isFavorite = user?.favorites.includes(song._id);

	return (
		<Box
			as={motion.div}
			initial="initial"
			animate="animate"
			variants={fadeInUp}
			rounded="lg"
			bg="zinc.900"
			minW={{ base: "8rem", md: "10rem" }}
			pb={4}
			overflow="hidden"
			role="group">
			<Box
				onClick={playSong}
				cursor="pointer"
				h={{ base: "8rem", md: "10rem" }}
				mb={4}
				overflow="hidden"
				position="relative">
				<Image
					src={task?.thumbnail?task?.thumbnail:task?.user?.avatar}
					alt={task?.name}
					w="full"
					roundedTop="base"
					transition="0.5s ease"
					_groupHover={{ transform: "scale(1.1)" }}
				/>
				<Box
					_groupHover={{ opacity: 1 }}
					opacity={0}
					transition="0.5s ease"
					display="flex"
					alignItems="center"
					justifyContent="center"
					bg="blackAlpha.700"
					position="absolute"
					top={0}
					left={0}
					w="full"
					h="full">
					<Button
						variant="unstyled"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						p={0}
						color="gray.300"
						rounded="full">
						{isPlaying && isCurrentTrack ? (
							<AiFillPauseCircle color="inherit" size={36} />
						) : (
							<AiFillPlayCircle color="inherit" size={36} />
						)}
					</Button>
				</Box>
			</Box>
			<Flex gap={2} justify="space-between">
				<Box px={2}>
					<Heading
						as="h5"
						fontSize={{ base: "sm", md: "md" }}
						noOfLines={1}
						fontWeight={500}>
						{task?.name}
					</Heading>
					<Link to={`/artiste/${task?.user._id}`}>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="zinc.400"
							noOfLines={1}>
							{" "}
							{task?.org}{" "}
						</Text>
					</Link>
				</Box>
				{user && (
					<Button
						variant="unstyled"
						_hover={{ color: "accent.transparent" }}
						color={isFavorite ? "accent.main" : "#b1b1b1"}
						minW={6}
						onClick={handleLike}>
						{isFavorite ? (
							<AiFillHeart color="inherit" />
						) : (
							<AiOutlineHeart color="inherit" />
						)}
					</Button>
				)}
			</Flex>
		</Box>
	);
};

export default SongCard;
