import { StyleSheet, Text, SafeAreaView, View, ScrollView} from 'react-native';
import Header from '../_components/Header';
import Footer from '../_components/Footer';
import { useState, useEffect } from 'react';
import AccordionPickUp from '../_components/AccordionPickUp';
import { Divider, Skeleton } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { HostUri } from '../_components/HostUri';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import CustomDatePick from '../_components/CustomDatePick';

export default function detailListPickup() {
    const { id } = useLocalSearchParams();
    const [bigdata, setBigData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('')
    
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
    await SecureStore.getItemAsync('secured_token').then((token) => {
      axios({
        method: "get",
        url: HostUri+`pickup/seller/${id}`,
        headers: {
          "Content-Type": 'application/json',
          "Authorization" : `Bearer ${token}`,
        },
      }).then(function (response) {
          // berhasil
          setLoading(false);
          setBigData(response.data.data);
        }).catch(function (error) {
          // masuk ke server tapi return error (unautorized dll)
          if (error.response) {
            //gagal login
            if(error.response.data.message == 'Unauthorized')
            {
              SecureStore.deleteItemAsync('secured_token');
              SecureStore.deleteItemAsync('secured_name');
              router.replace('/');
            }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
          } else if (error.request) {
            // ga konek ke server
            alert('Check Koneksi anda !')
            console.error(error.request);
          } else {
            // error yang ga di sangka2
            console.error("Error", error.message);
          }
      });
    });
    }
    const onPressUpdate = async (shipping_id, selected_choice = null, reason = '') =>{
        // choice
        //   {key:'1', value:'Pickup Sukses'},
        //   {key:'2', value:'Pickup Gagal'},
        let choice = [4, 3];
        // ALL REQUEST shipping_id, selected_tracking, alasan
        await SecureStore.getItemAsync('secured_token').then((token) => {
        axios({
          method: "post",
          url: HostUri+'pickup/update',
          headers: {
            "Content-Type": 'application/json',
            "Authorization" : `Bearer ${token}`,
          },
          data : {
            shipping_id: shipping_id,
            selected_tracking: choice[(selected_choice-1)],
            alasan : reason
        }
        }).then(function (response) {
            // berhasil
            // router.back();
            getData();
          }).catch(function (error) {
            // masuk ke server tapi return error (unautorized dll)
            if (error.response) {
              //gagal login
              if(error.response.data.message == 'Unauthorized')
              {
                SecureStore.deleteItemAsync('secured_token');
                SecureStore.deleteItemAsync('secured_name');
                router.replace('/');
              }
              // console.error(error.response.data);
              // console.error(error.response.status);
              // console.error(error.response.headers);
            } else if (error.request) {
              // ga konek ke server
              alert('Check Koneksi anda !')
              console.error(error.request);
            } else {
              // error yang ga di sangka2
              console.error("Error", error.message);
            }
        });
    });
    }

    return (
        <SafeAreaView style={styles.container}>

          <View style={styles.headerContainer}>
            <Header/>
          </View>

          <View style={styles.datepickContainer}>
            <View >
              <CustomDatePick />
            </View>
            <View>
              <CustomDatePick />
            </View>
          </View>

          <Divider
            style={{margin: 5 }}
            color="red"
            width={2}
            orientation="horizontal"
          />

            <ScrollView style={styles.listContainer}>
            {
                loading &&
                <View style={{ flex:1, flexDirection:'column', padding:5 }}>
                  {
                    [{},{},{},{},{},{},].map((l, i) => (
                      <Skeleton
                      // LinearGradientComponent={LinearGradient}
                      animation="pulse"
                      width={'100%'}
                      height={60}
                      style={{ marginBottom:5 }}
                      key={i}
                    />
                      ))
                  }
                </View>
                
              }
              {
                bigdata.map((l, i) => (
                    <AccordionPickUp data={ l } onPressUpdate ={onPressUpdate} key={i} />
                ))
              }
            </ScrollView>

          <Footer  />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection:'column',
  },
  headerContainer : {
    height:'10%'
  },
  headerChild : {
    flex: 1,
    flexDirection : 'row'
  },
  tanggal : {
    flex : 2,
    color:'grey',
    margin: 10
  },
  dropdownContainer : {
    flex:1,
    margin : 10,
    textAlign:'right',
    fontSize:16,
    fontWeight:'bold'
  },
  listContainer : {
    height:'70%',
    paddingHorizontal:10
  },
  datepickContainer : { 
    height:'10%',
    flexDirection : 'row', 
    alignItems: "center", 
    justifyContent: "space-evenly" 
  },
});