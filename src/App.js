import { useEffect, useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  CircularProgress,
  CircularProgressLabel,
  useToast,
  HStack,
  IconButton,
  Tooltip,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerCloseButton,
  Stack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Center,
} from "@chakra-ui/react";
import { CopyIcon, SettingsIcon } from '@chakra-ui/icons'
import totpGenerator from "totp-generator";
import copy from "copy-to-clipboard";

function App() {
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [maxSeconds, setMaxSeconds] = useState(30);
  const [digits, setDigits] = useState(6);
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [secret, setSecret] = useState(localStorage.getItem("secret") || "");
  const [totp, setTotp] = useState(null);
  useEffect(() => {
    let intervalId = null;
    if (secondsRemaining !== null && secondsRemaining > 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      handleTOTPClick();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsRemaining]);

  useEffect(() => {
    if (secret) {
      handleTOTPClick();
    }
  }, [secret, maxSeconds, digits]);

  const handleTOTPClick = () => {
    if (secret) {
      setTotp(totpGenerator(secret, {
        period: maxSeconds,
        digits: digits,
      }));
      localStorage.setItem("secret", secret);
      setSecondsRemaining(maxSeconds);
    }
  };


  const handleCopyTOTPClick = () => {
    if (totp) {
      copy(totp);
      toast({
        title: "TOTP copied to clipboard!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Container maxW="container.sm">
      <VStack spacing={8} mt={8}>
        <Heading size="lg">TOTP Generator</Heading>
        <FormControl id="secret">
          <FormLabel textAlign={"center"}>Secret Key</FormLabel>
          <Input
            type="text"
            value={secret}
            textAlign={"center"}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter or generate a secret key"
          />
        </FormControl>
        {totp && secret && (
          <>
            <Heading size="lg" p="2" px="5" bg="green.50" border="1px solid" borderColor="green.300" borderRadius="md">{totp}</Heading>
            <HStack>
              <Tooltip label="Copy TOTP to clipboard">
                <IconButton
                  icon={<CopyIcon />}
                  size={"sm"}
                  colorScheme="green"
                  aria-label="Copy TOTP to clipboard"
                  onClick={handleCopyTOTPClick}
                />
              </Tooltip>
              <CircularProgress
                value={100 - (secondsRemaining / maxSeconds * 100)}
                size="100px"
                thickness={4}
              >
                <CircularProgressLabel>
                  {secondsRemaining}s
                </CircularProgressLabel>
              </CircularProgress>
              <Tooltip label="Edit Settings">
                <IconButton
                  icon={<SettingsIcon />}
                  size={"sm"}
                  colorScheme="blue"
                  aria-label="Edit Settings"
                  onClick={() => { setDrawerOpen(true) }}
                />
              </Tooltip>
            </HStack>
          </>
        )}

        <Center mt="20">
          {/* Footer Built by Ian Manda */}
          <Text color={"gray.300"}>
            Built by{" "}
            <a
              href="https://www.github.com/ianaleck"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3182ce" }}
            >
              Ian Aleck.
            </a>
          </Text>
        </Center>
      </VStack>
      <Drawer
        isOpen={drawerOpen}
        placement="right"
        onClose={() => { setDrawerOpen(false) }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Update Settings</DrawerHeader>
          <Stack p="3">
            <FormControl id="maxSeconds">
              <FormLabel>Seconds: {maxSeconds}</FormLabel>
              <Slider
                aria-label="maxSeconds"
                defaultValue={maxSeconds}
                min={10}
                max={120}
                step={5}
                onChange={(value) => { setMaxSeconds(value) }}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>

            </FormControl>

            <FormControl id="maxDigits">
              <FormLabel>Digits: {digits}</FormLabel>
              <Slider
                aria-label="maxDigits"
                defaultValue={digits}
                min={4}
                max={12}
                step={1}
                onChange={(value) => { setDigits(value) }}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>

            </FormControl>
          </Stack>
        </DrawerContent>
      </Drawer>
    </Container>
  );
}

export default App;
