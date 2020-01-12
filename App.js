/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect, Component} from 'react';

import AsyncStorage from '@react-native-community/async-storage'

const key = 'state'

const initialState = [{
  city: 'Paris',
  country: 'France',
  id: 0,
  locations: []
},
{
  city: 'Busan',
  country: 'Korea',
  id: 1,
  locations: []
}]

import Tabs from './src'


export default class App extends Component {
  // cities 배열 만들고 초기화하기. 지금은 빈 배열임
  state = {
    cities: []
  }

  async componentDidMount() {
    console.log("component did mount")
    try {
      let cities = await AsyncStorage.getItem(key)
      if(cities){
        cities = JSON.parse(cities)
        this.setState({ cities })
      }      
    } catch (e) {
      console.log('error from AsyncStorage: ', e)
    }
  }


  //  state에 저장된 cities 도시 목록에 새 도시를 추가함
  addCity = (city) => {
    const cities = this.state.cities
    cities.push(city)
    this.setState({ cities })

    AsyncStorage.setItem(key, JSON.stringify(cities))
      .then(() => console.log('storage updated!'))
      .catch(e => console.log('e: ', e))


  }

  //선택된 도시에 속한 장소 배열에 새 장소를 추가함
  addLocation = (location, city) => {
    const index = this.state.cities.findIndex(item => {
      return item.id === city.id
    })
    const chosenCity = this.state.cities[index]
    chosenCity.locations.push(location)
    const cities = [
      ...this.state.cities.slice(0, index),
      chosenCity,
      ...this.state.cities.slice(index + 1)
    ]
    // this.setState({
    //   cities
    // })

    this.setState({
      cities
    }, () => {
      AsyncStorage.setItem(key, JSON.stringify(cities))
        .then(() => console.log('storage updated!'))
        .catch(e => console.log('e: ', e))
      })


  }
  
  // Tabs 컴포넌트를 반환하고 screenProps 객체를 전달함.
  // screenProps 객체는 cities 배열, addCity 메서드, addLocation 메서드를 포함함
  render() {
    return (
      <Tabs
        screenProps={{
          cities: this.state.cities,
          addCity: this.addCity,
          addLocation: this.addLocation
        }}
      />
    )
  }
}
