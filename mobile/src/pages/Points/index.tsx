import React, {useState,useEffect} from 'react';
import { View, StyleSheet,TouchableOpacity, Image, Text, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import {Feather as Icon} from '@expo/vector-icons'; //já vem instalados
import {useNavigation, useRoute} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';//carrega svg de link externo.
import api from '../../services/api'
import * as Location from 'expo-location'

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface Point{
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const [selectedItems,setSelectedItems] = useState<number[]>([]);
    const [items,setItem]=useState<Item[]>([]);
    const [points,setPoints]=useState<Point[]>([]);
    const [initialPosition,setInitialPosition]=useState<[number,number]>([0,0]);

    useEffect(()=>{
       async function loadPosition(){
           const {status} = await Location.requestPermissionsAsync();
           
           if (status !== 'granted'){
               Alert.alert('Opsss','Precisamos de sua permissão para obter a localização');
               return;
           }

           const location = await Location.getCurrentPositionAsync();

           const {latitude, longitude} = location.coords;
           //console.log('Posição inicial: Lat:'+latitude+' Lon:'+longitude);
           setInitialPosition([latitude,longitude]);
       }
       
       loadPosition();
    },[]);

    useEffect(()=>{
        api.get('/items').then(response => {
             setItem(response.data);
        });        
    },[]);


    useEffect(()=>{
        api.get('/points', {params:{
            city: routeParams.city, //'Formiga',
            uf: routeParams.uf, //'MG',
            items:selectedItems //[1,2,3,4,5,6]
        }}).then(response => {
             setPoints(response.data);
             //console.log('||---->>>>'+JSON.stringify(response.data));
        });        
    },[selectedItems]);    

    function handleNavagationBack(){
        navigation.goBack();
    }

    function handleNavagationDetail(id :number){
        navigation.navigate('Detail', {point_id: id});
    }    

    function handleSelectItem(id: number){

        const jaExiste = selectedItems.findIndex(item => item === id);
    
        if (jaExiste  >= 0){
           const filtrado = selectedItems.filter(item => item !== id);
           setSelectedItems(filtrado);
        }
        else {
            setSelectedItems([...selectedItems,id]);
        }  
      }

  return (
    <>  
      <View style={styles.container}>
         <TouchableOpacity onPress={handleNavagationBack}>
             <Icon name="arrow-left" size={20} color="#34cb79" />
         </TouchableOpacity>

         <Text style={styles.title}> Bem Vindo.</Text>
         <Text style={styles.description}> Encontre no mapa um ponto de coleta.</Text>

         <View style={styles.mapContainer}>
            {initialPosition[0] !== 0 &&
                <MapView style={styles.map}
                initialRegion={{
                    latitude:initialPosition[0],
                    longitude:initialPosition[1],
                    latitudeDelta: 0.014,
                    longitudeDelta: 0.014
                }}>
                {points.map(point => (
                    <Marker 
                       key={String(point.id)}
                       style={styles.mapMarker}
                       coordinate={{
                              latitude:point.latitude,
                              longitude:point.longitude
                         }}
                       onPress={()=>{handleNavagationDetail(point.id)}}>
                         <View style={styles.mapMarkerContainer}>    
                              <Image style={styles.mapMarkerImage}
                                     source={{ uri:point.image_url}}/>
                              <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                         </View>                            
                    </Marker>
                ))}

                </MapView>
            }
         </View>     
      </View>

      <View style={styles.itemsContainer}>
       <ScrollView horizontal 
                   showsHorizontalScrollIndicator={false}
                   contentContainerStyle={{paddingHorizontal: 20}}>


         {items.map(item => (
           <TouchableOpacity key={String(item.id)}
                             style={[styles.item,
                                     selectedItems.includes(item.id)?styles.selectedItem:{}]}
                             activeOpacity={0.7}
                             onPress={()=>{handleSelectItem(item.id)}}>
               <SvgUri width={42} height={42}
                       uri={item.image_url}/>
               <Text style={styles.itemTitle}>{item.title}</Text>        
           </TouchableOpacity>                                    
         ))}              
        </ScrollView>
      </View>
    </>  
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;