import 'react-native-gesture-handler';
import {Feather as Icon} from '@expo/vector-icons'; //já vem instalados
import React, {useState,useEffect} from 'react';
import {View, ImageBackground,StyleSheet, Image, Text, Platform} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse{
  sigla: string;
} 

interface IBGECityResponse{
  nome: string;
} 

interface Item{
  label: string;
  value: string;
} 

const Home = () => {

   const navigation = useNavigation();

   const [selectedUf,setSelectedUf] = useState('0');
   const [selectedCity,setSelectedCity] = useState('0');
   const [ufs,setUfs] = useState<Item[]>([]);
   const [cities,setCities] = useState<Item[]>([]);

   useEffect(()=>{

    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla); 
            let aux: Item[] = [];
            ufInitials.forEach(i => { 
                    aux.push({label: i, value: i});
            });
            setUfs(aux);
    }); 
   },[]);

   useEffect(()=>{
    console.log('===>'+selectedUf);
    if (selectedUf === '0')
       return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const citiesNames = response.data.map(c => c.nome); 
            let aux: Item[] = [];
            citiesNames.forEach(i => { 
                    aux.push({label: i, value: i});
            });
            setCities(aux);
    }); 
   },[selectedUf]);  

   function handleNavigateToPoints(){

       navigation.navigate('Points', {uf: selectedUf, city: selectedCity});
   }

   const placeholderCity = {
    label: 'Escolha um cidade',
    value: null,
    color: '#9EA0A4',
  };

  const placeholderUf = {
    label: 'Escolha uma estado',
    value: null,
    color: '#9EA0A4',
  };

    return (
       <ImageBackground source={require('../../assets/home-background.png')} 
                        style={styles.container}
                        imageStyle={{width: 274, height: 368}}>
           <View style={styles.main}>
              <Image source={require('../../assets/logo.png')}/>
              <Text style={styles.title}> Seu markeplace de coleta de resíduos</Text>
              <Text style={styles.description}> Ajudamos pessoas a encontrarem 
              pontos de coleta de forma eficiente.</Text>
           </View>

           <View style={styles.footer}>

                 <RNPickerSelect  style={
                                           Platform.OS === 'ios'
                                              ? {inputIOS: styles.inputIOS}
                                              : {inputAndroid: styles.inputAndroid}
                                        }
                                        placeholder={placeholderUf}
                                  onValueChange={(value) => setSelectedUf(value)}
                                  items={ufs}
                  />


                  <RNPickerSelect  style={
                                           Platform.OS === 'ios'
                                              ? {inputIOS: styles.inputIOS}
                                              : {inputAndroid: styles.inputAndroid}
                                        }
                                        placeholder={placeholderCity}
                                  onValueChange={(value) => setSelectedCity(value)}
                                  items={cities}
                  />
                 <RectButton style={styles.button}
                             onPress={handleNavigateToPoints}>
                     <View style={styles.buttonIcon}>
                     <Text> 
                        <Icon name="arrow-right" color="#FFF" size={24}/>
                     </Text>  
                     </View>
                     <Text style={styles.buttonText}>
                         Entrar
                     </Text>
                 </RectButton>
           </View>


       </ImageBackground>
       )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      backgroundColor: '#f0f0f5',
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    inputIOS:{
      fontSize: 16,
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
    },

    inputAndroid:{
      fontSize: 16,
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
    },

    select: {
   //   height: 60,
   //   backgroundColor: '#FFF',
   //   borderRadius: 10,
   //   marginBottom: 8,
   //   paddingHorizontal: 24,
   //   fontSize: 16,
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });
  

export default Home;