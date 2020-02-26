import React, { useState,useEffect } from 'react';
import {StyleSheet, Text, View, Image, TouchableWithoutFeedback} from 'react-native'
import star from "./assets/star.png";
import diamond from "./assets/diamond.png";
import question from "./assets/questions.png";
import triangle from "./assets/triangle.png";
import whitebox from "./assets/bluebox.png";
import circle from "./assets/full-moon.png";

const Card = ({key, index, img, flipped, matched}) => {
  return (
    <View>
      <Image
        style={{width: 100, height: 100, margin: 10}}
        source={matched ? whitebox : flipped ? img : question}
      />
    </View>
  )
}

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

const Puzzle = ({whenEnded}) => {
  const [cardlist, setCardlist] = useState(deck)
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
            <TouchableWithoutFeedback onPress={handleClick(index)} key={index}>
                <View>
                <Card
                    index={index}
                    img={card.img}
                    flipped={card.flipped}
                    matched={card.matched}
                />
                </View>
            </TouchableWithoutFeedback>
        )
      })
    } else {
      console.log('YAHAHOEE')
      const cur = new Date()
      const score = String(Math.round(1 / (cur - time) * 1000000))
      setTimeout(() => {
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
        whenEnded()
      }, 1250)
      return (
          <Text style={{fontSize: 32, marginTop: 40, color: '#ffffff'}}>Your score is {score}!</Text>
      )
    }
  }

  return (
    <>
        <Text style={{backgroundColor: '#7ab4ff', textAlign: 'center', paddingTop: 65, fontSize: 20}}>
            Match the cards as fast as you can!
        </Text>
        <View style={styles.board}>
        {renderCards()}
        </View>
    </>
  );
}

const styles = StyleSheet.create({
    board: {
        backgroundColor: '#7ab4ff',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        fontSize: 12,
        color: 'white',
        paddingVertical: 25
    }
})

export default Puzzle;