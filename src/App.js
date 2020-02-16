import React, { useState,useEffect } from 'react';
import './App.css';
import star from "./assets/star.svg";
import diamond from "./assets/diamond.png";
import question from "./assets/questions.png";
import triangle from "./assets/triangle.svg";
import whitebox from "./assets/whitebox.jpg";
import circle from "./assets/full-moon.svg";

const Card = ({key, index, img, flipped, matched}) => {

  return (
    <div className="Card">
      <img
        style={{width: 150, height: 150, padding: 20}}
        src={matched ? whitebox : flipped ? img : question}
      />
    </div>
  )
}

const App = () => {
  const [cardlist, setCardlist] = useState([])
  const [time, setTime] = useState(new Date())

  const handleClick = (index) => () => {
    let temp = cardlist
    temp[index].flipped = true;

    let numOfFlipped = 0
    let flipped = []
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].flipped) {
        numOfFlipped++
        flipped.push(i)
      }
    }
    if (flipped.length === 2 && temp[flipped[0]].img === temp[flipped[1]].img) {
      setTimeout(() => {
        temp[flipped[0]].matched = true;
        temp[flipped[1]].matched = true;
        temp[flipped[0]].flipped = false;
        temp[flipped[1]].flipped = false;
        setCardlist([...temp])
      }, 400)
    } else if (numOfFlipped == 2) {
      setTimeout(() => {
        for (let i = 0; i < temp.length; i++) temp[i].flipped = false
        setCardlist([...temp])
      }, 400)
    }
    setCardlist([...temp])
  }

  const renderCards = () => {
    let finished = true
    for (let card of cardlist) {
      if (!card.matched) {
        finished = false
        break;
      }
    }

    if (!finished) {
      return cardlist.map((card, index) => {
        return (
            <div onClick={handleClick(index)} key={index}>
              <Card
                index={index}
                img={card.img}
                flipped={card.flipped}
                matched={card.matched}
              />
            </div>
        )
      })
    } else {
      const cur = new Date()
      const score = String(Math.round(1 / (cur - time) * 1000000))
      return (
          <p>{score}</p>
      )
    }
  }

  useEffect(() => {
    let images = [star, diamond, triangle, circle]
    let deck = []
    images = images.concat(images)
    const length = images.length

    for (let i = 0; i < length; i++) {
      let index = Math.floor(Math.random() * images.length)
      deck.push({
        img: images[index],
        flipped: false,
        matched: false
      })
      images.splice(index, 1)
    }
    setCardlist(deck)
  },[])

  return (
    <div className="Board">
      {renderCards()}
    </div>
  );
}

export default App;
