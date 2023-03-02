import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { Switch, Stack, Input, Flex, Text, Button } from '@chakra-ui/react'
import { Account, PublicKey, Connection, Transaction, SystemProgram } from '@solana/web3.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha";
export default function Home() {
  const [toggle, setToggle] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isHuman, setIsHuman] = useState(false)
  async function airdropSolToAccount() {
    // Validate the account address

    if (!isValid) {

      toast.error('Invalid account address', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }


    // Connect to the Solana network
    try {
      const connection = new Connection(!toggle ? 'https://api.devnet.solana.com' : 'https://api.testnet.solana.com');
      setLoading(true)
      const confirmation = await connection.requestAirdrop(
        new PublicKey(inputValue),
        value * 1000000000
      )
      toast.success('🦄 Airdrop complete', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        description: `Transaction ${confirmation}`,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setInputValue("")
      setLoading(false)
    }
    catch (err) {
      toast.error('Error, Airdrop failed', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false)

      return false;
    }

  }
  const validateSolanaAddress = (addrs) => {
    try {
      let publicKey = new PublicKey(addrs);
      return PublicKey.isOnCurve(publicKey.toBytes());
    } catch (err) {
      // console.error(err);
      return false;
    }
  };
  useEffect(() => {
    const isValid = validateSolanaAddress(inputValue);
    console.log(isValid)
    setIsValid(isValid);
  }, [inputValue]);


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  // Function to handle the switch toggle
  const handleSwitchToggle = () => {
    setToggle(!toggle);

  }

  function handleValueChange(event) {
    setValue(event.target.value);
  }




  const handleSend = () => {
    airdropSolToAccount();
  };


  let view = <div />
  if (inputValue.length > 0) {
    view = <div>
      {!isValid ? <Text fontSize='md' color={"tomato"}>❌ Invalid Account</Text> : <Text fontSize='md' color={"green"}>✅ Valid</Text>}
    </div>

  }
  function onChange(value) {
    console.log("Captcha value:", value);
    setIsHuman(true)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Sololo</title>
        <meta name="description" content="Solana token created to represent value on the Solana blockchain and stored in user accounts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.animateCharcter}>
          Sololo
        </h1>
        <h3 className={styles.animateCharcter2}>
          Faucet
        </h3>

        <p className={styles.description}>
          Have a drink! The premium faucet for Solana Devnet and Testnet.
        </p>

        <Flex alignItems="center" mt={10} mb={5} >
          <Text mr={2} fontSize='xl' color={"blue.300"} opacity={toggle ? 1 : 0.3}>TestNet</Text>
          <Switch
            sx={{
              'span.chakra-switch__track:not([data-checked])': {
                backgroundColor: 'pink.300'
              }
            }}
            isChecked={toggle}
            onChange={handleSwitchToggle}
            size='lg'
          />
          <Text ml={2} fontSize='xl' color='pink' opacity={!toggle ? 1 : 0.3}>DevNet</Text>
        </Flex>

        <Input placeholder='Enter Solana account address...'
          bg={'blue.100'}
          color={'black'}
          maxWidth={"md"}
          value={inputValue} onChange={handleInputChange}
          _placeholder={{
            opacity: 1, color: 'grey'
          }} size='lg' />

        {view}

        {/* Switch toggle */}
        <Flex alignItems="center" mt={10} mb={5}>
          <Text mr={2} fontSize='xl' color={"blue.300"}>Airdrop Sol</Text>
          <Input
            size="sm"
            bg={'blue.100'}
            type="number"
            value={value}
            onChange={handleValueChange}
            w={10}
          />
          <Text ml={2} fontSize='xl' color={"blue.300"}>Account</Text>
        </Flex>
        {
          !isHuman ?

            <ReCAPTCHA
              sitekey="6LfbmcgkAAAAAAVI4mo7iSXRsJcnOEVQz_FrvgSx"
              onChange={onChange}
            /> :

            <Button isDisabled={value < 1} colorScheme="whatsapp" onClick={handleSend} isLoading={loading}>Send {value} Sol</Button>

        }

        <Text fontSize='sm' mt={10} color={"white"} opacity={0.7}>(Button will be disable if account is not valid & token amount is less then 1  )</Text>

      </main>

      <ToastContainer />

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
