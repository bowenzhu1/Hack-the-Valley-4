import React, { useState,useEffect } from 'react';
import './App.css';
import star from "./assets/star.svg";
import diamond from "./assets/diamond.png";
import question from "./assets/questions.png";
import triangle from "./assets/triangle.svg";
import whitebox from "./assets/whitebox.jpg";
import circle from "./assets/full-moon.svg";

function Card({parentCallback, image, i}) {
  const [flipped, setFlipped] = useState(false)
  const [matched, setMatched] = useState(false)

  function sendData() {
    setFlipped(!flipped)
    console.log("flip")
    parentCallback(i, flipped, matched)
  }

  function displayCard() {
    if (matched) {
      return whitebox
    } else if (flipped) {
      return image
    }
    return question
  }

  return (
    <div className="Card" onClick={sendData}>
      <img style={{width: 200, height: 200}}
        src={displayCard()} />
    </div>
  )
}

function App() {
  const [cardlist, setCardlist] = useState([])
  useEffect(() => {
    const images = [star, diamond, triangle, circle]
    const doubleImages = images.concat(images)
    const range = doubleImages.length
    let deck = []
    for (let i = 0; i < range; i++) {
      let randomIndex = Math.floor(Math.random() * doubleImages.length)
      deck.push({image: doubleImages[randomIndex],
                 flipped: false,
                 matched: false
      })
      doubleImages.splice(randomIndex, 1)
    }
    setCardlist(deck)
  },[])

  function displayCard(card) {
    if (card.matched) {
      return whitebox
    } else if (card.flipped) {
      console.log("displayed")
      return card.image
    } else {
    console.log("Displayed question")
    return question
    }
  }

  function makeDeck() {
    let deck = []
    console.log("we are making a deck")
    for (let i = 0; i < cardlist.length; i++) {
      deck.push(<Card i={i} image={displayCard(cardlist[i])} parentCallback={callbackFunction} />)
    }
    return deck
  }

  function callbackFunction(i, flipped, matched) {
    let temp = cardlist
    let flippedCount = 0
    let flippedCards = []
    temp[i].flipped = !flipped
    temp[i].matched = matched
    console.log(temp)
    for (let x = 0; x < temp.length; x++) {
      if (temp[x].flipped) {
        flippedCards.push(x)
        flippedCount += 1
      }
    }
    if (flippedCount >= 2) {
      console.log("we made it")
      console.log(flippedCards)
      if (temp[flippedCards[0]].image == temp[flippedCards[1]].image) {
        console.log(temp)
        temp[flippedCards[0]].matched = true
        temp[flippedCards[1]].matched = true
        temp[flippedCards[0]].flipped = false
        temp[flippedCards[1]].flipped = false
        console.log("match found")
      } else {
      temp[flippedCards[0]].flipped = false
      temp[flippedCards[1]].flipped = false
      flippedCards = []
      flippedCount = 0
      console.log("shin ryujin")
      }
    }
    setCardlist(temp)
    console.log(cardlist)
  }

  return (
    <div className="Board">
      {makeDeck()}
    </div>
  );
}

export default App;
