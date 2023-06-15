import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useContract, useNFTs, useContractRead, Web3Button, ConnectWallet } from "@thirdweb-dev/react";
import { NFT_CONTRACT_ADDRESS } from "../const/addresses";
import { NFTCard } from "../components/NFTCard";
import { useState } from "react"


const Home: NextPage = () => {
  const count = 30;
  const [number, setNumber] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleChangeNumber = (event:any) => {
    setNumber(event.target.value);
  }

  const handleChangeQuestion = (event:any) => {
    setQuestion(event.target.value);
  }

  const handleChangeAnswer = (event:any) => {
    setAnswer(event.target.value);
  }

  const handleNewChangeNumber = (event:any) => {
    setNewNumber(event.target.value);
  }

  const handleNewChangeQuestion = (event:any) => {
    setNewQuestion(event.target.value);
  }

  const handleNewChangeAnswer = (event:any) => {
    setNewAnswer(event.target.value);
  }

  const [page, setPage] = useState(1);
  let tempQuestions = [];
  let tempAnswers = [];
  let tempComments = [];

  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  for (let i = 1; i <= 10; i++) {
    const { data: questions } = useContractRead(contract, "questionTextByQuestionNumber", [i])
    tempQuestions.push(questions);
  }

  for (let i = 1; i <= 10; i++) {
    const { data: answers } = useContractRead(contract, "answerTextByQuestionNumber", [i])
    tempAnswers.push(answers);
  }

  for (let i = 1; i <= 10; i++) {
    const { data: comments } = useContractRead(contract, "commentCountByQuestion", [i])
    tempComments.push(comments);
  }

  const { data: nfts, isLoading: isLoadingNFTs } = useNFTs(
    contract,
    {
      count: count,
      start: (page - 1) * count
    }
  )
  return (
    <div className={styles.container}>
      <ConnectWallet />
      <input type="text" value={number} onChange={handleChangeNumber} placeholder="Number"/>
      <input type="text" value={question} onChange={handleChangeQuestion} placeholder="Question"/>
      <input type="text" value={answer} onChange={handleChangeAnswer} placeholder="Answer"/>
      <Web3Button
      contractAddress="0x7C89A17595D162EC95aecb79080cC11a72c8cd76"
      action={async (contract) => {
        try {
          await contract.call("setQuestion", [number, question, answer]);
          alert('Question has been successfully changed!');
        } catch (err) {
          alert(`An error occurred`);
        }
      }}
    >
      setQuestion
    </Web3Button>
      <div className={styles.NFTGrid}>

        
      {tempQuestions.map((question, index) => (
        <div key={index} className={styles.test}>Q {index + 1} : {question}</div>
      ))}
      </div>

      <div className={styles.NFTGrid}>
      {tempAnswers.map((answer, index) => (
        <div key={index} className={styles.test}>Q {index + 1} : {answer}</div>
      ))}
      </div>

      {/* <div className={styles.NFTGrid}>
      {tempComments.map((comment, index) => (
        <div key={index} className={styles.test}>Q {index + 1} : {comment}</div>
      ))}
      </div> */}
      <div className={styles.NFTGrid}>
      {!isLoadingNFTs && (
        nfts?.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ) 
      ))}
      </div>

      <input type="text" value={newNumber} onChange={handleNewChangeNumber} placeholder="Number"/>
      <input type="text" value={newQuestion} onChange={handleNewChangeQuestion} placeholder="Question"/>
      <input type="text" value={newAnswer} onChange={handleNewChangeAnswer} placeholder="Answer"/>
      <Web3Button
      contractAddress="0x7C89A17595D162EC95aecb79080cC11a72c8cd76"
      action={async (contract) => {
        try {
          await contract.call("changeQuestion", [newNumber, newQuestion, newAnswer]);
          alert('Question has been successfully changed!');
        } catch (err) {
          alert(`An error occurred`);
        }
      }}
    >
      setQuestion
    </Web3Button>
      <div className={styles.pagnation}>
        <button onClick={() => setPage(page - 1)} disabled={page===1}>Previous</button>
        <input 
          type="number"
          value={page}
          onChange={(e) => setPage(parseInt(e.target.value))}
        />
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Home;
