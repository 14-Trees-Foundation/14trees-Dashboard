import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  TextField,
  Autocomplete
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";

// import { GetCroppedImg } from "../../../helpers/imageCrop";
import { useState } from "react";

export const Location = ({ values, setValues }) => {

   const [districtFlag , setFlag] = useState('')
    const [talukaFlag , setTalukaFlag] = useState('')


  //     const handleDistrictChange=(e , value)=>{
  //   setDistrict(value)
  //   console.log(value.label)
  //   setFlag(value.label)

  // }


  // const handleTalukaChange=(e , value)=>{
    
  //   setTaluka(value)
  //   setTalukaFlag(value.label)

  // }

  // const handleVillageChange=(e , value)=>{
    
  //   setVillage(value)
    
  // }


  const DistrictOptions = [
    { value: 'Pune', label: 'Pune' },
    { value: 'Jalgaon', label: 'Jalgaon' },
    { value: 'Budhana', label: 'Budhana' },
    { value: 'Sambhajinagar', label: 'Sambhajinagar' },
  ];
  

  const TalukaOptions = [
    { value: 'Khed (खेड)', label: 'Khed (खेड)' },
    { value: 'Shirur (शिरूर)', label: 'Shirur (शिरूर)' },
    { value: 'Ambegaon (आंबेगाव)', label: 'Ambegaon (आंबेगाव)' },
    { value: 'Haveli (हवेली)', label: 'Haveli (हवेली)' },
    { value: 'Pune City (पुणे शहर)', label: 'Pune City (पुणे शहर)' },
    { value: 'Baramati (बारामती)', label: 'Baramati (बारामती)' },
    { value: 'Junnar (जुन्नर)', label: 'Junnar (जुन्नर)' },
    { value: 'Indapur (इंदापूर)', label: 'Indapur (इंदापूर)' },
    { value: 'Daund (दौंड)', label: 'Daund (दौंड)' },
    { value: 'Maval (मावळ)', label: 'Maval (मावळ)' },
    { value: 'Purandar (पुरंदर)', label: 'Purandar (पुरंदर)' },
    { value: 'Bhor (भोर)', label: 'Bhor (भोर)' },
    { value: 'Mulshi (मुळशी)', label: 'Mulshi (मुळशी)' },
    { value: 'Velha (वेल्हा)', label: 'Velha (वेल्हा)' },
    { value: 'Nandura (नांदुरा)', label: 'Nandura (नांदुरा)' },
    { value: 'Motala (मोताळा)', label: 'Motala (मोताळा)' },
    { value: 'Khamgaon (खामगाव)', label: 'Khamgaon (खामगाव)' }
  ];

      const BudhanaOptions = [
        { value: 'Budhana', label: 'Budhana' },
        { value: 'Nandura (नांदुरा)', label: 'Nandura (नांदुरा)' },
        { value: 'Motala (मोताळा)', label: 'Motala (मोताळा)' },
        { value: 'Khamgaon (खामगाव)', label: 'Khamgaon (खामगाव)' },
        { value: 'Malkapur', label: 'Malkapur' }

      ];

      const  JalgaonOptions = [
        { value: 'Jamner', label: 'Jamner' },
      ];

      const PuneOptions = [
        { value: 'Ambegaon (आंबेगाव)', label: 'Ambegaon (आंबेगाव)' },
        { value: 'Indapur (इंदापूर)', label: 'Indapur (इंदापूर)' },
        { value: 'Khed (खेड)', label: 'Khed (खेड)' },
      ];

      const SambhajinagarOptions = [
      
        { value: 'Soegaon', label: 'Soegaon' }
      ];

      const BudhanaDTOptions = [
        { value: 'Afjalpur (अफजलपुर)', label: 'Afjalpur (अफजलपुर)' },
        { value: 'Ajispur (अजिसपूर)', label: 'Ajispur (अजिसपूर)' },
        { value: 'Ambhoda (आंभोडा)', label: 'Ambhoda (आंभोडा)' },
        { value: 'Antriteli (अंत्रीतेली)', label: 'Antriteli (अंत्रीतेली)' },
        { value: 'Atakal (अटकळ)', label: 'Atakal (अटकळ)' },
        { value: 'Awalkhed (आवळखेड)', label: 'Awalkhed (आवळखेड)' },
        { value: 'Bhadgaon (भडगांव)', label: 'Bhadgaon (भडगांव)' },
        { value: 'Bhadola (भादोला)', label: 'Bhadola (भादोला)' },
        { value: 'Birsingpur (बिरसिंगपूर)', label: 'Birsingpur (बिरसिंगपूर)' },
        { value: 'Bodegaon (बोदेगाव)', label: 'Bodegaon (बोदेगाव)' },
        { value: 'Borkhed (बोरखेड)', label: 'Borkhed (बोरखेड)' },
        { value: 'Borkhed (Dhad) (बोरखेड (धाड))', label: 'Borkhed (Dhad) (बोरखेड (धाड))' },
        { value: 'Buldhana (बुलढाणा)', label: 'Buldhana (बुलढाणा)' },
        { value: 'Chandol Bhag 1 (चांडोळ भाग 1)', label: 'Chandol Bhag 1 (चांडोळ भाग 1)' },
        { value: 'Chandol Bhag 2 (चांडोळ भाग 2)', label: 'Chandol Bhag 2 (चांडोळ भाग 2)' },
        { value: 'Chautha (चौथा)', label: 'Chautha (चौथा)' },
        { value: 'Chikhala (चिखला)', label: 'Chikhala (चिखला)' },
        { value: 'Dahid Bk. (दहीद बु.)', label: 'Dahid Bk. (दहीद बु.)' },
        { value: 'Dahid Kh. (दहीद खु.)', label: 'Dahid Kh. (दहीद खु.)' },
        { value: 'Dalsawangi (ढालसावंगी)', label: 'Dalsawangi (ढालसावंगी)' },
        { value: 'Dasalwadi (डासाळवाडी)', label: 'Dasalwadi (डासाळवाडी)' },
        { value: 'Dattapur (दत्तपूर)', label: 'Dattapur (दत्तपूर)' },
        { value: 'Deulghat (देऊळघाट)', label: 'Deulghat (देऊळघाट)' },
        { value: 'Devhari (देव्हारी)', label: 'Devhari (देव्हारी)' },
        { value: 'Devpur (देवपुर)', label: 'Devpur (देवपुर)' },
        { value: 'Dhad Bhag 1 (धाड भाग 1)', label: 'Dhad Bhag 1 (धाड भाग 1)' },
        { value: 'Dhad Bhag 2 (धाड भाग 2)', label: 'Dhad Bhag 2 (धाड भाग 2)' },
        { value: 'Dhamangaon (धामणगांव)', label: 'Dhamangaon (धामणगांव)' },
        { value: 'Dhangarpur (ढंगारपूर)', label: 'Dhangarpur (ढंगारपूर)' },
        { value: 'Domrul (डोमरुळ)', label: 'Domrul (डोमरुळ)' },
        { value: 'Dongar Khandala (डोंगर खंडाळा)', label: 'Dongar Khandala (डोंगर खंडाळा)' },
        { value: 'Dudha (दुधा)', label: 'Dudha (दुधा)' },
        { value: 'Ghatnandra (घाटनांद्रा)', label: 'Ghatnandra (घाटनांद्रा)' },
        { value: 'Girda (गिरडा)', label: 'Girda (गिरडा)' },
        { value: 'Gondankhed (गोंदनखेड)', label: 'Gondankhed (गोंदनखेड)' },
        { value: 'Gondhankhed Chautha (गोंधनखेड चौथा)', label: 'Gondhankhed Chautha (गोंधनखेड चौथा)' },
        { value: 'Gummi (गुम्मी)', label: 'Gummi (गुम्मी)' },
        { value: 'Hanwatkhed (हनवतखेड)', label: 'Hanwatkhed (हनवतखेड)' },
        { value: 'Hatedi Bk. (हतेडी बु.)', label: 'Hatedi Bk. (हतेडी बु.)' },
        { value: 'Hatedi Kh. (हातेडी खु.)', label: 'Hatedi Kh. (हातेडी खु.)' },
        { value: 'Ijalapur (ईजलापुर)', label: 'Ijalapur (ईजलापुर)' },
        { value: 'Irala (ईरला)', label: 'Irala (ईरला)' },
        { value: 'Ismailpur (इस्माइलपुर)', label: 'Ismailpur (इस्माइलपुर)' },
        { value: 'Jamathi (जामठी)', label: 'Jamathi (जामठी)' },
        { value: 'Jamb (जांब)', label: 'Jamb (जांब)' },
        { value: 'Jambharun (जांभरूण)', label: 'Jambharun (जांभरूण)' },
        { value: 'Januna (जनुना)', label: 'Januna (जनुना)' },
        { value: 'Kardi (करडी)', label: 'Kardi (करडी)' },
        { value: 'Kesapur (केसापूर)', label: 'Kesapur (केसापूर)' },
        { value: 'Kherdi (खेरडी)', label: 'Kherdi (खेरडी)' },
        { value: 'Khupgaon (खूपगाव)', label: 'Khupgaon (खूपगाव)' },
        { value: 'Kolwad (कोलवड)', label: 'Kolwad (कोलवड)' },
        { value: 'Kulamkhed (कुलमखेड)', label: 'Kulamkhed (कुलमखेड)' },
        { value: 'Kumbefal (कुंबेफळ)', label: 'Kumbefal (कुंबेफळ)' },
        { value: 'Madh (मढ)', label: 'Madh (मढ)' },
        { value: 'Malvihir (माळविहीर)', label: 'Malvihir (माळविहीर)' },
        { value: 'Malwandi (माळवंडी)', label: 'Malwandi (माळवंडी)' },
        { value: 'Masrul (मासरुळ)', label: 'Masrul (मासरुळ)' },
        { value: 'Matala (मातला)', label: 'Matala (मातला)' },
        { value: 'Maundhala (मौंढाळा)', label: 'Maundhala (मौंढाळा)' },
        { value: 'Merkhed (मेरखेड)', label: 'Merkhed (मेरखेड)' },
        { value: 'Mhasla Bk. (म्हसला बु.)', label: 'Mhasla Bk. (म्हसला बु.)' },
        { value: 'Mhasla Kh. (म्हसला खु.)', label: 'Mhasla Kh. (म्हसला खु.)' },
        { value: 'Mohoj (मोहोज)', label: 'Mohoj (मोहोज)' },
        { value: 'Nandrakoli (नांद्राकोळी)', label: 'Nandrakoli (नांद्राकोळी)' },
        { value: 'Padli (पाडळी)', label: 'Padli (पाडळी)' },
        { value: 'Palaskhed Bhat (पळसखेड भट)', label: 'Palaskhed Bhat (पळसखेड भट)' },
        { value: 'Palaskhed Nago (पळसखेड नागो)', label: 'Palaskhed Nago (पळसखेड नागो)' },
        { value: 'Palaskhed Naik (पळसखेड नाईक)', label: 'Palaskhed Naik (पळसखेड नाईक)' },
        { value: 'Paldhag (पलढग)', label: 'Paldhag (पलढग)' },
        { value: 'Pangari Bhag 2 (पांगरी भाग 2)', label: 'Pangari Bhag 2 (पांगरी भाग 2)' },
        { value: 'Pangarkhed (पांगरखेड)', label: 'Pangarkhed (पांगरखेड)' },
        { value: 'Pangri Bhag 1 (पांगरी भाग 1)', label: 'Pangri Bhag 1 (पांगरी भाग 1)' },
        { value: 'Pimpalgaon Sarai (पिंपळगाव सराई)', label: 'Pimpalgaon Sarai (पिंपळगाव सराई)' },
        { value: 'Pimparkhed (पिंपरखेड)', label: 'Pimparkhed (पिंपरखेड)' },
        { value: 'Pokhari (पोखरी)', label: 'Pokhari (पोखरी)' },
        { value: 'Raypur Bhag 1 (रायपूर भाग 1)', label: 'Raypur Bhag 1 (रायपूर भाग 1)' },
        { value: 'Raypur Bhag 2 (रायपूर भाग 2)', label: 'Raypur Bhag 2 (रायपूर भाग 2)' },
        { value: 'Ruikhed Mayamba (रुईखेड मायंबा)', label: 'Ruikhed Mayamba (रुईखेड मायंबा)' },
        { value: 'Ruikhed Tekale (रुईखेड टेकाळे)', label: 'Ruikhed Tekale (रुईखेड टेकाळे)' },
        { value: 'Sagwan (सागवन)', label: 'Sagwan (सागवन)' },
        { value: 'Sakhali Bk. Bhag 1 (साखळी बु.भाग 1)', label: 'Sakhali Bk. Bhag 1 (साखळी बु.भाग 1)' },
        { value: 'Sakhali Bu.Bhag 2 (साखळी बु.भाग 2)', label: 'Sakhali Bu.Bhag 2 (साखळी बु.भाग 2)' },
        { value: 'Sakhali Kh. (साखळी खु.)', label: 'Sakhali Kh. (साखळी खु.)' },
        { value: 'Satgaon (Mahsala) (सातगांव (म्हसला))', label: 'Satgaon (Mahsala) (सातगांव (म्हसला))' },
        { value: 'Sav (सव)', label: 'Sav (सव)' },
        { value: 'Sawala (सावळा)', label: 'Sawala (सावळा)' },
        { value: 'Sawali (सावळी)', label: 'Sawali (सावळी)' },
        { value: 'Shekapur (शेकापूर)', label: 'Shekapur (शेकापूर)' },
        { value: 'Shirpur (शिरपूर)', label: 'Shirpur (शिरपूर)' },
        { value: 'Sindkhed (सिंदखेड)', label: 'Sindkhed (सिंदखेड)' },
        { value: 'Soyagaon (सोयगांव)', label: 'Soyagaon (सोयगांव)' },
        { value: 'Sundarkhed (सुंदरखेड)', label: 'Sundarkhed (सुंदरखेड)' },
        { value: 'Takli (टाकळी)', label: 'Takli (टाकळी)' },
        { value: 'Tandulwadi (तांदूळवाडी)', label: 'Tandulwadi (तांदूळवाडी)' },
        { value: 'Taradkhed (तराडखेड)', label: 'Taradkhed (तराडखेड)' },
        { value: 'Tarapur (तारापुर)', label: 'Tarapur (तारापुर)' },
        { value: 'Umala (उमाळा)', label: 'Umala (उमाळा)' },
        { value: 'Umarkhed (उमरखेड)', label: 'Umarkhed (उमरखेड)' },
        { value: 'Warud (वरूड)', label: 'Warud (वरूड)' },
        { value: 'Warwand (वरवंड)', label: 'Warwand (वरवंड)' },
        { value: 'Yelgaon (येळगांव)', label: 'Yelgaon (येळगांव)' },
        { value: 'Zari (झरी)', label: 'Zari (झरी)' },
      ];

      const BudhanaKhamgaonOptions = [
        { value: "Aasa (आसा)", label: "Aasa (आसा)" },
        { value: "Adgaon (अडगाव)", label: "Adgaon (अडगाव)" },
        { value: "Akoli (अकोली)", label: "Akoli (अकोली)" },
        { value: "Ambetakali (अंबेटाकळी)", label: "Ambetakali (अंबेटाकळी)" },
        { value: "Ambikapur (अंबिकापुर)", label: "Ambikapur (अंबिकापुर)" },
        { value: "Amsari (आमसरी)", label: "Amsari (आमसरी)" },
        { value: "Antraj Bhag 1 (अंत्रज भाग1)", label: "Antraj Bhag 1 (अंत्रज भाग1)" },
        { value: "Antraj Bhag 2 (अंत्रज भाग 2)", label: "Antraj Bhag 2 (अंत्रज भाग 2)" },
        { value: "Atali Bhag 1 (अटाळी भाग 1)", label: "Atali Bhag 1 (अटाळी भाग 1)" },
        { value: "Atali Bhag 2 (अटाळी भाग 2)", label: "Atali Bhag 2 (अटाळी भाग 2)" },
        { value: "Awar (आवार)", label: "Awar (आवार)" },
        { value: "Belkhed (बेलखेड)", label: "Belkhed (बेलखेड)" },
        { value: "Belura (बेलुरा)", label: "Belura (बेलुरा)" },
        { value: "Bhalegaon (भालेगाव)", label: "Bhalegaon (भालेगाव)" },
        { value: "Bhandari (भंडारी)", label: "Bhandari (भंडारी)" },
        { value: "Bhendi (भेंडी)", label: "Bhendi (भेंडी)" },
        { value: "Bori (बोरी)", label: "Bori (बोरी)" },
        { value: "Borjawala (बोरजवळा)", label: "Borjawala (बोरजवळा)" },
        { value: "Bothakaji (बोथाकाजी)", label: "Bothakaji (बोथाकाजी)" },
        { value: "Bothakoli (बोथाकोली)", label: "Bothakoli (बोथाकोली)" },
        { value: "Chikhali Bk. (चिखली बु.)", label: "Chikhali Bk. (चिखली बु.)" },
        { value: "Chikhali Kh. (चिखली खु.)", label: "Chikhali Kh. (चिखली खु.)" },
        { value: "Chinchkhed Band (चिंचखेड बंद)", label: "Chinchkhed Band (चिंचखेड बंद)" },
        { value: "Chinchpur Bhag 1 (चिंचपूर भाग 1)", label: "Chinchpur Bhag 1 (चिंचपूर भाग 1)" },
        { value: "Chinchpur Bhag 2 (चिंचपूर भाग 2)", label: "Chinchpur Bhag 2 (चिंचपूर भाग 2)" },
        { value: "Chitoda (चितोडा)", label: "Chitoda (चितोडा)" },
        { value: "Dadham (दधम)", label: "Dadham (दधम)" },
        { value: "Dastapur (दस्तापूर)", label: "Dastapur (दस्तापूर)" },
        { value: "Deulkhed (देऊळखेड)", label: "Deulkhed (देऊळखेड)" },
        { value: "Dhapati (धापटी)", label: "Dhapati (धापटी)" },
        { value: "Dhorapgaon (ढोरपगांव)", label: "Dhorapgaon (ढोरपगांव)" },
        { value: "Dhotra (धोतरा)", label: "Dhotra (धोतरा)" },
        { value: "Divthana (दिवठाणा)", label: "Divthana (दिवठाणा)" },
       
            { value: 'Dondwada (दोंदवाडा)', label: 'Dondwada (दोंदवाडा)' },
            { value: 'Dudha (दुधा)', label: 'Dudha (दुधा)' },
            { value: 'Dyangangapur (ज्ञानगंगापूर)', label: 'Dyangangapur (ज्ञानगंगापूर)' },
            { value: 'Fattepur (फत्तेपुर)', label: 'Fattepur (फत्तेपुर)' },
            { value: 'Ganeshpur (Maharkhed) (गणेशपूर (महारखेड))', label: 'Ganeshpur (Maharkhed) (गणेशपूर (महारखेड))' },
            { value: 'Garadgaon (गारडगांव)', label: 'Garadgaon (गारडगांव)' },
            { value: 'Gawandhala (गंवढाळा)', label: 'Gawandhala (गंवढाळा)' },
            { value: 'Geru (गेरु)', label: 'Geru (गेरु)' },
            { value: 'Gerumatargaon (गेरुमाटरगांव)', label: 'Gerumatargaon (गेरुमाटरगांव)' },
            { value: 'Ghanegaon (घाणेगांव)', label: 'Ghanegaon (घाणेगांव)' },
            { value: 'Gharod Bhag 1 (घारोड भाग 1)', label: 'Gharod Bhag 1 (घारोड भाग 1)' },
            { value: 'Gharod Bhag 2 (घारोड भाग 2)', label: 'Gharod Bhag 2 (घारोड भाग 2)' },
            { value: 'Ghatpuri (घाटपुरी)', label: 'Ghatpuri (घाटपुरी)' },
            { value: 'Gondhanapur (गोंधणापूर)', label: 'Gondhanapur (गोंधणापूर)' },
            { value: 'Hingana Umara (हिंगणा उमरा)', label: 'Hingana Umara (हिंगणा उमरा)' },
            { value: 'Hingna Karegaon (हिंगणा कारेगांव)', label: 'Hingna Karegaon (हिंगणा कारेगांव)' },
            { value: 'Hiwarkhed (हिवरखेड)', label: 'Hiwarkhed (हिवरखेड)' },
            { value: 'Hiwra Bk. (हिवरा बु.)', label: 'Hiwra Bk. (हिवरा बु.)' },
            { value: 'Hiwra Kh. (हिवरा खु.)', label: 'Hiwra Kh. (हिवरा खु.)' },
            { value: 'Iwara (इवरा)', label: 'Iwara (इवरा)' },
            { value: 'Jaipur Lande (जयपुर लांडे)', label: 'Jaipur Lande (जयपुर लांडे)' },
            { value: 'Jalaka Bhadang (जळका भडंग)', label: 'Jalaka Bhadang (जळका भडंग)' },
            { value: 'Jalka Teli (जळका तेली)', label: 'Jalka Teli (जळका तेली)' },
            { value: 'Januna (जनुना)', label: 'Januna (जनुना)' },
            { value: 'Jayramgad (जयरामगड)', label: 'Jayramgad (जयरामगड)' },
            { value: 'Kadamapur (कदमापूर)', label: 'Kadamapur (कदमापूर)' },
            { value: 'Kalegaon (काळेगांव)', label: 'Kalegaon (काळेगांव)' },
            { value: 'Kanchanpur (कंचनपुर)', label: 'Kanchanpur (कंचनपुर)' },
            { value: 'Kanzara (कंझारा)', label: 'Kanzara (कंझारा)' },
            { value: 'Karegaon Bk. (कारेगांव बु.)', label: 'Karegaon Bk. (कारेगांव बु.)' },
            { value: 'Karegaon Kh. (कारेगांव खु.)', label: 'Karegaon Kh. (कारेगांव खु.)' },
            { value: 'Kasarkhed (कासारखेड)', label: 'Kasarkhed (कासारखेड)' },
            { value: 'Kawadgaon (कवडगांव)', label: 'Kawadgaon (कवडगांव)' },
            { value: 'Khamgaon Gramin (खामगाव ग्रामीण)', label: 'Khamgaon Gramin (खामगाव ग्रामीण)' },
        { value: 'Kherdi (खेर्डी)', label: 'Kherdi (खेर्डी)' },
        { value: 'Kherdi Ujad (खेरडी उजाड)', label: 'Kherdi Ujad (खेरडी उजाड)' },
        { value: 'Kholkhed (खोलखेड)', label: 'Kholkhed (खोलखेड)' },
        { value: 'Khutpuri (खुटपूरी)', label: 'Khutpuri (खुटपूरी)' },
        { value: 'Kinhi Mahadeo (किन्ही महादेव)', label: 'Kinhi Mahadeo (किन्ही महादेव)' },
        { value: 'Kokta (कोक्ता)', label: 'Kokta (कोक्ता)' },
        { value: 'Kolori (कोलोरी)', label: 'Kolori (कोलोरी)' },
        { value: 'Konti (कोंटी)', label: 'Konti (कोंटी)' },
        { value: 'Kumbhephal (कुंभेफळ)', label: 'Kumbhephal (कुंभेफळ)' },
        { value: 'Kurha (कु-हा)', label: 'Kurha (कु-हा)' },
        { value: 'Lakhanwada Bk. (लाखनवाडा बु.)', label: 'Lakhanwada Bk. (लाखनवाडा बु.)' },
        { value: 'Lakhanwada Kh. (लाखनवाडा खु.)', label: 'Lakhanwada Kh. (लाखनवाडा खु.)' },
        { value: 'Lanjud Bhag 1 (लांजुड भाग 1)', label: 'Lanjud Bhag 1 (लांजुड भाग 1)' },
        { value: 'Lanjud Bhag 2 (लांजुड भाग 2)', label: 'Lanjud Bhag 2 (लांजुड भाग 2)' },
        { value: 'Lasura Jahangir (लासुरा जहॉगीर)', label: 'Lasura Jahangir (लासुरा जहॉगीर)' },
        { value: 'Lokhanda (लोखंडा)', label: 'Lokhanda (लोखंडा)' },
        { value: 'Loni Gurav (लोणी गुरव)', label: 'Loni Gurav (लोणी गुरव)' },
        { value: 'Makta (मक्ता)', label: 'Makta (मक्ता)' },
        { value: 'Mandaka (मांडका)', label: 'Mandaka (मांडका)' },
        { value: 'Mandni (मांडणी)', label: 'Mandni (मांडणी)' },
        { value: 'Mathani (माथणी)', label: 'Mathani (माथणी)' },
        { value: 'Nagapur (नागापूर)', label: 'Nagapur (नागापूर)' },
        { value: 'Nagzari Bk. (नागझरी बु.)', label: 'Nagzari Bk. (नागझरी बु.)' },
        { value: 'Nagzari Kh. (नागझरी खु.)', label: 'Nagzari Kh. (नागझरी खु.)' },
        { value: 'Nandri (नांद्री)', label: 'Nandri (नांद्री)' },
        { value: 'Naydevi (नायदेवी)', label: 'Naydevi (नायदेवी)' },
        { value: 'Nilegaon (निळेगांव)', label: 'Nilegaon (निळेगांव)' },
        { value: 'Nimkawala (निमकवळा)', label: 'Nimkawala (निमकवळा)' },
        { value: 'Nimkhed (निमखेड)', label: 'Nimkhed (निमखेड)' },
        { value: 'Nipana (निपाणा)', label: 'Nipana (निपाणा)' },
        { value: 'Nirod (निरोड)', label: 'Nirod (निरोड)' },
        { value: 'Pala (पाला)', label: 'Pala (पाला)' },
        { value: 'Palshi Bk (पळशी बु.)', label: 'Palshi Bk (पळशी बु.)' },
        { value: 'Palshi Kh. (पळशी खु.)', label: 'Palshi Kh. (पळशी खु.)' },
        { value: 'Parkhed Bhag 1 (पारखेड भाग 1)', label: 'Parkhed Bhag 1 (पारखेड भाग 1)' },
        { value: 'Parkhed Bhag 2 (पारखेड भाग 2)', label: 'Parkhed Bhag 2 (पारखेड भाग 2)' },
        { value: "Patonda (पातोंडा)", label: "Patonda (पातोंडा)" },
        { value: "Pedka (पेडका)", label: "Pedka (पेडका)" },
        { value: "Pimpalchoch (पिंपळचोच)", label: "Pimpalchoch (पिंपळचोच)" },
        { value: "Pimpalgaon Raja Bhag 1 (पिंपळगांव राजा भाग 1)", label: "Pimpalgaon Raja Bhag 1 (पिंपळगांव राजा भाग 1)" },
        { value: "Pimpalgaon Raja Bhag 2 (पिंपळगांव राजा भाग 2)", label: "Pimpalgaon Raja Bhag 2 (पिंपळगांव राजा भाग 2)" },
        { value: "Pimprala (पिंपरला)", label: "Pimprala (पिंपरला)" },
        { value: "Pimpri Deshmukh (पिंपरी देशमुख)", label: "Pimpri Deshmukh (पिंपरी देशमुख)" },
        { value: "Pimpri Dhangar (पिंपरी धनगर)", label: "Pimpri Dhangar (पिंपरी धनगर)" },
        { value: "Pimpri Gawli (पिंपरी गवळी)", label: "Pimpri Gawli (पिंपरी गवळी)" },
        { value: "Pimpri Korde (पिंपरी कोरडे)", label: "Pimpri Korde (पिंपरी कोरडे)" },
        { value: "Pimpri Mohadar (पिंपरी मोहदार)", label: "Pimpri Mohadar (पिंपरी मोहदार)" },
        { value: "Poraj (पोरज)", label: "Poraj (पोरज)" },
        { value: "Rahud (राहुड)", label: "Rahud (राहुड)" },
        { value: "Ramnagar (रामनगर)", label: "Ramnagar (रामनगर)" },
        { value: "Rohana (रोहणा)", label: "Rohana (रोहणा)" },
        { value: "Sajanpuri (साजनपुरी)", label: "Sajanpuri (साजनपुरी)" },
        { value: "Sambhapur (संभापुर)", label: "Sambhapur (संभापुर)" },
        { value: "Sarola (सारोळा)", label: "Sarola (सारोळा)" },
        { value: "Sarola Ujad (सारोळा उजाड)", label: "Sarola Ujad (सारोळा उजाड)" },
        { value: "Sawargaon Bk. (सावरगांव बु.)", label: "Sawargaon Bk. (सावरगांव बु.)" },
        { value: "Sawargaon Kh. (सावरगांव खु.)", label: "Sawargaon Kh. (सावरगांव खु.)" },
        { value: "Sawarkhed (सावरखेड)", label: "Sawarkhed (सावरखेड)" },
        { value: "Shahapur (शहापूर)", label: "Shahapur (शहापूर)" },
        { value: "Shelodi (शेलोडी)", label: "Shelodi (शेलोडी)" },
        { value: "Shendri (शेंद्री)", label: "Shendri (शेंद्री)" },
        { value: "Shendri (Sambhapur) (शेंद्री (संभापूर))", label: "Shendri (Sambhapur) (शेंद्री (संभापूर))" },
        { value: "Shirala (शिराळा)", label: "Shirala (शिराळा)" },
        { value: "Shirla Nemane (शिर्ला नेमाने)", label: "Shirla Nemane (शिर्ला नेमाने)" },
        { value: "Shridhar Nagar (श्रीधर नगर)", label: "Shridhar Nagar (श्रीधर नगर)" },
        { value: "Sirasgaon Deshmukh (सिरसगांव देशमुख)", label: "Sirasgaon Deshmukh (सिरसगांव देशमुख)" },
        { value: "Sujatpur (सुजातपुर)", label: "Sujatpur (सुजातपुर)" },
        { value: 'Sutala Bk. (सुटाळा बु.)', label: 'Sutala Bk. (सुटाळा बु.)' },
        { value: 'Sutala Kh. (सुटाळा खु.)', label: 'Sutala Kh. (सुटाळा खु.)' },
        { value: 'Takli (टाकळी)', label: 'Takli (टाकळी)' },
        { value: 'Tandulwadi (तांदूळवाडी)', label: 'Tandulwadi (तांदूळवाडी)' },
        { value: 'Tarodanath (तरोडानाथ)', label: 'Tarodanath (तरोडानाथ)' },
        { value: 'Tembhurna (टेंभूरणा)', label: 'Tembhurna (टेंभूरणा)' },
        { value: 'Umara Lasura (उमरा लासुरा)', label: 'Umara Lasura (उमरा लासुरा)' },
        { value: 'Umra (उमरा)', label: 'Umra (उमरा)' },
        { value: 'Umra Atali (उमरा अटाळी)', label: 'Umra Atali (उमरा अटाळी)' },
        { value: 'Vihigaon Bhag 1 (विहिगाव भाग 1)', label: 'Vihigaon Bhag 1 (विहिगाव भाग 1)' },
        { value: 'Vihigaon Bhag 2 (विहिगांव भाग 2)', label: 'Vihigaon Bhag 2 (विहिगांव भाग 2)' },
        { value: 'Wadji (वडजी)', label: 'Wadji (वडजी)' },
        { value: 'Wahala Kh. (वहाळा खु.)', label: 'Wahala Kh. (वहाळा खु.)' },
        { value: 'Waki (वाकी)', label: 'Waki (वाकी)' },
        { value: 'Wakud (वाकूड)', label: 'Wakud (वाकूड)' },
        { value: 'Warkhed (वरखेड)', label: 'Warkhed (वरखेड)' },
        { value: 'Warna (वर्णा)', label: 'Warna (वर्णा)' },
        { value: 'Wazar (वझर)', label: 'Wazar (वझर)' },
        { value: 'Zodga (झोडगा)', label: 'Zodga (झोडगा)' }       
          
      ]

      const BudhanaMalkapurOptions = [
        { value: 'Aland (आळंद)', label: 'Aland (आळंद)' },
        { value: 'Anurabad (अनुराबाद)', label: 'Anurabad (अनुराबाद)' },
        { value: 'Bahapura (बहापुरा)', label: 'Bahapura (बहापुरा)' },
        { value: 'Belad (बेलाड)', label: 'Belad (बेलाड)' },
        { value: 'Bhadgani (भाडगणी)', label: 'Bhadgani (भाडगणी)' },
        { value: 'Bhalegaon (भालेगांव)', label: 'Bhalegaon (भालेगांव)' },
        { value: 'Bhangura (भानगुरा)', label: 'Bhangura (भानगुरा)' },
        { value: 'Chikhali (चिखली)', label: 'Chikhali (चिखली)' },
        { value: 'Chinchkhed Bk. (चिंचखेड बु.)', label: 'Chinchkhed Bk. (चिंचखेड बु.)' },
        { value: 'Chinchol (चिंचोल)', label: 'Chinchol (चिंचोल)' },
        { value: 'Dasarkhed (दसरखेड)', label: 'Dasarkhed (दसरखेड)' },
        { value: 'Datala Bhag 1 (दाताळा भाग 1)', label: 'Datala Bhag 1 (दाताळा भाग 1)' },
        { value: 'Datala Bhag 2 (दाताळा भाग 2)', label: 'Datala Bhag 2 (दाताळा भाग 2)' },
        { value: 'Deodhaba (देवधाबा)', label: 'Deodhaba (देवधाबा)' },
        { value: 'Dharangaon (धरणगाव)', label: 'Dharangaon (धरणगाव)' },
        { value: 'Dudhalgaon Bk. (दुधलगाव बु.)', label: 'Dudhalgaon Bk. (दुधलगाव बु.)' },
        { value: 'Dudhalgaon Kh. (दुधलगांव खु.)', label: 'Dudhalgaon Kh. (दुधलगांव खु.)' },
        { value: 'Gadegaon (गाडेगाव)', label: 'Gadegaon (गाडेगाव)' },
        { value: 'Gahukhed (गहुखेड)', label: 'Gahukhed (गहुखेड)' },
        { value: 'Gaulkhed (गौलखेड)', label: 'Gaulkhed (गौलखेड)' },
        { value: 'Ghirni Bhag 1 (घिर्णी भाग 1)', label: 'Ghirni Bhag 1 (घिर्णी भाग 1)' },
        { value: 'Ghirni Bhag 2 (घिर्णी भाग 2)', label: 'Ghirni Bhag 2 (घिर्णी भाग 2)' },
        { value: 'Ghodi (घोडी)', label: 'Ghodi (घोडी)' },
        { value: 'Gorad (गोराड)', label: 'Gorad (गोराड)' },
        { value: 'Harankhed (हरणखेड)', label: 'Harankhed (हरणखेड)' },
        { value: 'Harsoda (हरसोडा)', label: 'Harsoda (हरसोडा)' },
        { value: 'Hingana Kazi (हिंगणा काजी)', label: 'Hingana Kazi (हिंगणा काजी)' },
        { value: 'Hingana Nagapur (हिंगणा नागापूर)', label: 'Hingana Nagapur (हिंगणा नागापूर)' },
        { value: 'Hingane Dharangaon (हिंगने धरणगाव)', label: 'Hingane Dharangaon (हिंगने धरणगाव)' },
        { value: 'Jalalabad (जलालाबाद)', label: 'Jalalabad (जलालाबाद)' },
        { value: 'Jambhuldhaba (जांबुळधाबा)', label: 'Jambhuldhaba (जांबुळधाबा)' },
        { value: 'Kalegaon (काळेगाव)', label: 'Kalegaon (काळेगाव)' },
        { value: 'Kamrdipur (कमर्दीपूर)', label: 'Kamrdipur (कमर्दीपूर)' },
        { value: 'Khadki (खडकी)', label: 'Khadki (खडकी)' },
        { value: 'Khamkhed (खामखेड)', label: 'Khamkhed (खामखेड)' },
        { value: 'Khaparkhed (खापरखेड)', label: 'Khaparkhed (खापरखेड)' },
        { value: 'Khokodi (खोकोडी)', label: 'Khokodi (खोकोडी)' },
        { value: 'Korwad (कोरवाड)', label: 'Korwad (कोरवाड)' },
        { value: 'Kund Bk. (कुंड बु.)', label: 'Kund Bk. (कुंड बु.)' },
        { value: 'Kund Kh. (कुंड खु.)', label: 'Kund Kh. (कुंड खु.)' },
        { value: 'Lahe Kh. (लहे खु.)', label: 'Lahe Kh. (लहे खु.)' },
        { value: 'Lasura (लासूरा)', label: 'Lasura (लासूरा)' },
        { value: 'Lonwadi (लोणवाडी)', label: 'Lonwadi (लोणवाडी)' },
        { value: 'Makner (माकनेर)', label: 'Makner (माकनेर)' },
        { value: 'Malkapur Bhag 1 (मलकापूर भाग 1)', label: 'Malkapur Bhag 1 (मलकापूर भाग 1)' },
        { value: 'Malkapur Bhag 2 (मलकापूर भाग 2)', label: 'Malkapur Bhag 2 (मलकापूर भाग 2)' },
        { value: 'Malkapur Bhag 3 (मलकापूर भाग 3)', label: 'Malkapur Bhag 3 (मलकापूर भाग 3)' },
        { value: 'Mhaiswadi (म्हैसवाडी)', label: 'Mhaiswadi (म्हैसवाडी)' },
        { value: 'Morkhed Bk. (मोरखेड बु.)', label: 'Morkhed Bk. (मोरखेड बु.)' },
        { value: 'Morkhed Kh. (मोरखेड खु.)', label: 'Morkhed Kh. (मोरखेड खु.)' },
        { value: 'Narwel Bhag 1 (नरवेल भाग 1)', label: 'Narwel Bhag 1 (नरवेल भाग 1)' },
        { value: 'Narwel Bhag 2 (नरवेल भाग 2)', label: 'Narwel Bhag 2 (नरवेल भाग 2)' },
        { value: 'Nimbari (निंबारी)', label: 'Nimbari (निंबारी)' },
        { value: 'Nimboli (निंबोळी)', label: 'Nimboli (निंबोळी)' },
        { value: 'Nimkhed Pr.Vadner (निमखेड प्र.वाडनेर)', label: 'Nimkhed Pr.Vadner (निमखेड प्र.वाडनेर)' },
        { value: 'Panhera (पान्हेरा)', label: 'Panhera (पान्हेरा)' },
        { value: 'Pimpalkhunta Mahadev (पिंपळखुटा महादेव)', label: 'Pimpalkhunta Mahadev (पिंपळखुटा महादेव)' },
        { value: 'Pimpalkhuta Pr.Vadner (पिंपळखुटा प्र. वडनेर)', label: 'Pimpalkhuta Pr.Vadner (पिंपळखुटा प्र. वडनेर)' },
        { value: 'Rangaon (रणगांव)', label: 'Rangaon (रणगांव)' },
        { value: 'Rantham (रनथम)', label: 'Rantham (रनथम)' },
        { value: 'Rastapur (रास्तापुर)', label: 'Rastapur (रास्तापुर)' },
        { value: 'Sawali (सावळी)', label: 'Sawali (सावळी)' },
        { value: 'Shiradhon (शिराढोण)', label: 'Shiradhon (शिराढोण)' },
        { value: 'Shivni (शिवणी)', label: 'Shivni (शिवणी)' },
        { value: 'Talaswada (तालसवाडा)', label: 'Talaswada (तालसवाडा)' },
        { value: 'Tandulwadi (तांदुलवाडी)', label: 'Tandulwadi (तांदुलवाडी)' },
        { value: 'Telkhed (तेलखेड)', label: 'Telkhed (तेलखेड)' },
        { value: 'Tighra (तिघ्रा)', label: 'Tighra (तिघ्रा)' },
        { value: 'Umali (उमाळी)', label: 'Umali (उमाळी)' },
        { value: 'Wadji (वडजी)', label: 'Wadji (वडजी)' },
        { value: 'Wadoda (वडोदा)', label: 'Wadoda (वडोदा)' },
        { value: 'Waghola (वाघोळा)', label: 'Waghola (वाघोळा)' },
        { value: 'Waghud (वाघुड)', label: 'Waghud (वाघुड)' },
        { value: 'Wajirabad (वजीराबाद)', label: 'Wajirabad (वजीराबाद)' },
        { value: 'Wakodi (वाकोडी)', label: 'Wakodi (वाकोडी)' },
        { value: 'Warkhed (वरखेड)', label: 'Warkhed (वरखेड)' },
        { value: 'Wiwara (विवरा)', label: 'Wiwara (विवरा)' },
        { value: 'Zodga (झोडगा)', label: 'Zodga (झोडगा)' }
    
      ]

      const BudhanaMotalaOptions = [
          
            { value: 'Advihir (आडविहीर)', label: 'Advihir (आडविहीर)' },
            { value: 'Ajadarad (अजदरड)', label: 'Ajadarad (अजदरड)' },
            { value: 'Antri (अंत्री)', label: 'Antri (अंत्री)' },
            { value: 'Avhayunuspur (आव्हायुनूसपूर)', label: 'Avhayunuspur (आव्हायुनूसपूर)' },
            { value: 'Behardad (बेहरदड)', label: 'Behardad (बेहरदड)' },
            { value: 'Bhortek (भोरटेक)', label: 'Bhortek (भोरटेक)' },
            { value: 'Borakhedi (बोराखेडी)', label: 'Borakhedi (बोराखेडी)' },
            { value: 'Bramhanda (ब्राम्हंदा)', label: 'Bramhanda (ब्राम्हंदा)' },
            { value: 'Chawarda (चावर्दा)', label: 'Chawarda (चावर्दा)' },
            { value: 'Chinchkhed Kh. (चिंचखेड खु.)', label: 'Chinchkhed Kh. (चिंचखेड खु.)' },
            { value: 'Chinchkhed Nath (चिंचखेड नाथ)', label: 'Chinchkhed Nath (चिंचखेड नाथ)' },
            { value: 'Chinchpur (चिचपूर)', label: 'Chinchpur (चिचपूर)' },
            { value: 'Chunpimpri (चुनपिंप्रि)', label: 'Chunpimpri (चुनपिंप्रि)' },
            { value: 'Dabha (दाभा)', label: 'Dabha (दाभा)' },
            { value: 'Dabhadi (दाभाडी)', label: 'Dabhadi (दाभाडी)' },
            { value: 'Dahigaon (दहिगांव)', label: 'Dahigaon (दहिगांव)' },
            { value: 'Dhamangaon Badhe Bhag 1 (धामणगाव बढे भाग 1)', label: 'Dhamangaon Badhe Bhag 1 (धामणगाव बढे भाग 1)' },
            { value: 'Dhamangaon Badhe Bhag 2 (धामणगाव बढे भाग 2)', label: 'Dhamangaon Badhe Bhag 2 (धामणगाव बढे भाग 2)' },
            { value: 'Dhamangaon Deshmukh (धामणगांव देशमुख)', label: 'Dhamangaon Deshmukh (धामणगांव देशमुख)' },
            { value: 'Dhonkhed (धोनखेड)', label: 'Dhonkhed (धोनखेड)' },
            { value: 'Didola Bk (डिडोळा बु.)', label: 'Didola Bk (डिडोळा बु.)' },
            { value: 'Didola Kh. (डिडोळा खु.)', label: 'Didola Kh. (डिडोळा खु.)' },
            { value: 'Dudhamal (दुधमाळ)', label: 'Dudhamal (दुधमाळ)' },
            { value: 'Fardapur (फर्दापूर)', label: 'Fardapur (फर्दापूर)' },
            { value: 'Ghusar Bk. (घुसर बु.)', label: 'Ghusar Bk. (घुसर बु.)' },
            { value: 'Ghusar Kh. (घुसर खु.)', label: 'Ghusar Kh. (घुसर खु.)' },
            { value: 'Giroli (गिरोली)', label: 'Giroli (गिरोली)' },
            { value: 'Gotmara (गोतमारा)', label: 'Gotmara (गोतमारा)' },
            { value: 'Gugali (गुगळी)', label: 'Gugali (गुगळी)' },
            { value: 'Gulbheli (गुळभेली)', label: 'Gulbheli (गुळभेली)' },
            { value: 'Hanwatkhed Gotmara (हनवतखेड गोतमारा)', label: 'Hanwatkhed Gotmara (हनवतखेड गोतमारा)' },
            { value: 'Hanwatkhed Sarolapir (हनवतखेड सारोळापीर)', label: 'Hanwatkhed Sarolapir (हनवतखेड सारोळापीर)' },
            { value: 'Harmod (हरमोड)', label: 'Harmod (हरमोड)' },
            { value: 'Ibrahimpur (इब्राहीमपूर)', label: 'Ibrahimpur (इब्राहीमपूर)' },
            { value: 'Isalwadi (इसालवाडी)', label: 'Isalwadi (इसालवाडी)' },
            { value: 'Jahagirpur (जहागीरपूर)', label: 'Jahagirpur (जहागीरपूर)' },
            { value: 'Jaipur (जयपुर)', label: 'Jaipur (जयपुर)' },
            { value: 'Jamalpur (जमालपुर)', label: 'Jamalpur (जमालपुर)' },
            { value: 'Jamathi (जामठी)', label: 'Jamathi (जामठी)' },
            { value: 'Januna (जनुना)', label: 'Januna (जनुना)' },
            { value: 'Kabarkhed (काबरखेड)', label: 'Kabarkhed (काबरखेड)' },
            { value: 'Kajampur (काजमपुर)', label: 'Kajampur (काजमपुर)' },
            { value: 'Kalegaon (काळेगांव)', label: 'Kalegaon (काळेगांव)' },
            { value: 'Khadki (खडकी)', label: 'Khadki (खडकी)' },
            { value: 'Khairkhed (खैरखेड)', label: 'Khairkhed (खैरखेड)' },
            { value: 'Khamkhed (खामखेड)', label: 'Khamkhed (खामखेड)' },
            { value: 'Khandwa Bhag 1 (खांडवा भाग 1)', label: 'Khandwa Bhag 1 (खांडवा भाग 1)' },
            { value: 'Khandwa Bhag 2 (खांडवा भाग 2)', label: 'Khandwa Bhag 2 (खांडवा भाग 2)' },
            { value: 'Kharbadi (खरबडी)', label: 'Kharbadi (खरबडी)' },
            { value: 'Khedi (खेडी)', label: 'Khedi (खेडी)' },
            { value: 'Kinhola (किन्होळा)', label: 'Kinhola (किन्होळा)' },
            { value: 'Kolhi Gawali (कोल्हीगवळी)', label: 'Kolhi Gawali (कोल्हीगवळी)' },
            { value: 'Kolhi Golar (कोल्ही गोलर)', label: 'Kolhi Golar (कोल्ही गोलर)' },
            { value: 'Korhala (को-हाळा)', label: 'Korhala (को-हाळा)' },
            { value: 'Kothali (कोथळी)', label: 'Kothali (कोथळी)' },
            { value: 'Kurha (कु-हा)', label: 'Kurha (कु-हा)' },
            { value: 'Lapali (लपाली)', label: 'Lapali (लपाली)' },
            { value: 'Liha Bk. (लिहा बु.)', label: 'Liha Bk. (लिहा बु.)' },
            { value: 'Longhat (लोणघाट)', label: 'Longhat (लोणघाट)' },
            { value: 'Mahalpimpri (महाल पिंप्री)', label: 'Mahalpimpri (महाल पिंप्री)' },
            { value: 'Mahalungi Jahagir (महाळुंगी जहागीर)', label: 'Mahalungi Jahagir (महाळुंगी जहागीर)' },
            { value: 'Makodi (माकोडी)', label: 'Makodi (माकोडी)' },
            { value: "Malegaon (माळेगाव)", label: "Malegaon (माळेगाव)" },
            { value: "Mohegaon (मोहेगाव)", label: "Mohegaon (मोहेगाव)" },
            { value: "Motala (मोताळा)", label: "Motala (मोताळा)" },
            { value: "Murti (मुर्ती)", label: "Murti (मुर्ती)" },
            { value: "Naik Nagar (नाईक नगर)", label: "Naik Nagar (नाईक नगर)" },
            { value: 'Nalkund (नळकुंड)', label: 'Nalkund (नळकुंड)' },
            { value: 'Nhavi (न्हावी)', label: 'Nhavi (न्हावी)' },
            { value: 'Nimkhalli (निमखल्ली)', label: 'Nimkhalli (निमखल्ली)' },
            { value: 'Nimkhed (निमखेड)', label: 'Nimkhed (निमखेड)' },
            { value: 'Nipana (निपाणा)', label: 'Nipana (निपाणा)' },
            { value: 'Pangarkhed (पांगरखेड)', label: 'Pangarkhed (पांगरखेड)' },
            { value: 'Panhera Khedi (पान्हेरा खेडी)', label: 'Panhera Khedi (पान्हेरा खेडी)' },
            { value: 'Parda (परडा)', label: 'Parda (परडा)' },
            { value: 'Pimpalgaon Devi Bhag 1 (पिपंळगाव देवी भाग 1)', label: 'Pimpalgaon Devi Bhag 1 (पिपंळगाव देवी भाग 1)' },
            { value: 'Pimpalgaon Devi Bhag 2 (पिपंळगाव देवी भाग 2)', label: 'Pimpalgaon Devi Bhag 2 (पिपंळगाव देवी भाग 2)' },
            { value: 'Pimpalgaon Nath (पिंपळगांव नाथ)', label: 'Pimpalgaon Nath (पिंपळगांव नाथ)' },
            { value: 'Pimpalpati (पिंपळपाटी)', label: 'Pimpalpati (पिंपळपाटी)' },
            { value: 'Pimpri Gawali (पिंप्रीगवळी)', label: 'Pimpri Gawali (पिंप्रीगवळी)' },
            { value: 'Pokhari (पोखरी)', label: 'Pokhari (पोखरी)' },
            { value: 'Pophali (पोफळी)', label: 'Pophali (पोफळी)' },
            { value: 'Punhai (पुन्हई)', label: 'Punhai (पुन्हई)' },
            { value: 'Rahera (राहेरा)', label: 'Rahera (राहेरा)' },
            { value: 'Rajur (राजुर)', label: 'Rajur (राजुर)' },
            { value: 'Ramgaon (रामगांव)', label: 'Ramgaon (रामगांव)' },
            { value: 'Ridhora Jahagir (रिधोरा जहागीर)', label: 'Ridhora Jahagir (रिधोरा जहागीर)' },
            { value: 'Ridhora Khandopant (रिधोरा खंडोपंत)', label: 'Ridhora Khandopant (रिधोरा खंडोपंत)' },
            { value: 'Rohinkhed (रोहिणखेड)', label: 'Rohinkhed (रोहिणखेड)' },
            { value: 'Sahastramuli (सहस्त्रमुळी)', label: 'Sahastramuli (सहस्त्रमुळी)' },
            { value: 'Sanglad Pr.Rajur (सांगळद प्र. राजुर)', label: 'Sanglad Pr.Rajur (सांगळद प्र. राजुर)' },
            { value: 'Sarola Maroti (सारोळा मारोती)', label: 'Sarola Maroti (सारोळा मारोती)' },
            { value: 'Sarola Pir (सारोळा पिर)', label: 'Sarola Pir (सारोळा पिर)' },
            { value: 'Sawargaon Jahagir (सावरगांव जहागीर)', label: 'Sawargaon Jahagir (सावरगांव जहागीर)' },
            { value: 'Shahapur (शहापूर)', label: 'Shahapur (शहापूर)' },
            { value: 'Shelapur Bk. (शेलापूर बु.)', label: 'Shelapur Bk. (शेलापूर बु.)' },
            { value: 'Shelapur Kh (शेलापूर खु.)', label: 'Shelapur Kh (शेलापूर खु.)' },
            { value: 'Shelgaon Bajar (शेलगांव बाजार)', label: 'Shelgaon Bajar (शेलगांव बाजार)' },
            { value: 'Shirwa (शिरवा)', label: 'Shirwa (शिरवा)' },
            { value: 'Sindkhed Lapali (सिंदखेड लपाली)', label: 'Sindkhed Lapali (सिंदखेड लपाली)' },
            { value: 'Sirmil (सिरमिल)', label: 'Sirmil (सिरमिल)' },
            { value: 'Sonbarad Pr.Malkapur (सोनबरड प्र.मलकापुर)', label: 'Sonbarad Pr.Malkapur (सोनबरड प्र.मलकापुर)' },
            { value: 'Sonbarad Pr.Rohinkhed (सोनबरड प्र.रोहिणखेड)', label: 'Sonbarad Pr.Rohinkhed (सोनबरड प्र.रोहिणखेड)' },
            { value: 'Sultanpur (सुलतानपूर)', label: 'Sultanpur (सुलतानपूर)' },
            { value: 'Takli Pr.Malkapur (टाकळी प्र.मलकापुर)', label: 'Takli Pr.Malkapur (टाकळी प्र.मलकापुर)' },
            { value: 'Takli Pr.Rajur (टाकळी प्र.राजूर)', label: 'Takli Pr.Rajur (टाकळी प्र.राजूर)' },
            { value: 'Talkhed (तालखेड)', label: 'Talkhed (तालखेड)' },
            { value: 'Talni (तळणी)', label: 'Talni (तळणी)' },
            { value: 'Tapowan (तपोवन)', label: 'Tapowan (तपोवन)' },
            { value: 'Taroda (तरोडा)', label: 'Taroda (तरोडा)' },
            { value: 'Tembhi (टेंभी)', label: 'Tembhi (टेंभी)' },
            { value: 'Thad (थड)', label: 'Thad (थड)' },
            { value: 'Tighra (तिघ्रा)', label: 'Tighra (तिघ्रा)' },
            { value: 'Ubalkhed (उबाळखेड)', label: 'Ubalkhed (उबाळखेड)' },
            { value: 'Urha (उ-हा)', label: 'Urha (उ-हा)' },
            { value: 'Wadgaon Jamalpur (वडगांव जमालपूर)', label: 'Wadgaon Jamalpur (वडगांव जमालपूर)' },
            { value: 'Wadgaon Mahalungi (वडगांव महाळूगी)', label: 'Wadgaon Mahalungi (वडगांव महाळूगी)' },
            { value: 'Wadgaon Pr.Rohinkhed (वडगांव प्र.रोहिणखेड)', label: 'Wadgaon Pr.Rohinkhed (वडगांव प्र.रोहिणखेड)' },
            { value: 'Wadi (वाडी)', label: 'Wadi (वाडी)' },
            { value: 'Waghjal (वाघजाळ)', label: 'Waghjal (वाघजाळ)' },
            { value: 'Warud (वरूड)', label: 'Warud (वरूड)' },
            { value: 'Waruli (वारुळी)', label: 'Waruli (वारुळी)' },
            { value: 'Yakatpur (याकतपुर)', label: 'Yakatpur (याकतपुर)' }
      ]

      const BudhanaNanduraOptions = [
        { value: 'Ahmadpur (अहमदपुर)', label: 'Ahmadpur (अहमदपुर)' },
        { value: 'Alampur (अलमपूर)', label: 'Alampur (अलमपूर)' },
        { value: 'Amboda (अंबोंडा)', label: 'Amboda (अंबोंडा)' },
        { value: 'Aurangapur (औरंगपूर)', label: 'Aurangapur (औरंगपूर)' },
        { value: 'Avdha Bk. (अवधा बु.)', label: 'Avdha Bk. (अवधा बु.)' },
        { value: 'Avdha Kh. (अवधा खु.)', label: 'Avdha Kh. (अवधा खु.)' },
        { value: 'Barafgaon (बरफगांव)', label: 'Barafgaon (बरफगांव)' },
        { value: 'Belad Pr.Jalgaon (बेलाड प्र. जळगांव)', label: 'Belad Pr.Jalgaon (बेलाड प्र. जळगांव)' },
        { value: 'Belura (बेलुरा)', label: 'Belura (बेलुरा)' },
        { value: 'Bhilvadi (भिलवडी)', label: 'Bhilvadi (भिलवडी)' },
        { value: 'Bhogalwadi (भोगलवाडी)', label: 'Bhogalwadi (भोगलवाडी)' },
        { value: 'Bhorwand (भोरवंड)', label: 'Bhorwand (भोरवंड)' },
        { value: 'Bhota (भोटा)', label: 'Bhota (भोटा)' },
        { value: 'Bhuising (भुईसिंग)', label: 'Bhuising (भुईसिंग)' },
        { value: 'Burti Pr.Chandur (बुर्टी प्र. चांदूर)', label: 'Burti Pr.Chandur (बुर्टी प्र. चांदूर)' },
        { value: 'Burti Pr.Wadner (बुर्टी प्र. वडनेर)', label: 'Burti Pr.Wadner (बुर्टी प्र. वडनेर)' },
        { value: 'Chandur Biswa (चांदूर बिस्वा)', label: 'Chandur Biswa (चांदूर बिस्वा)' },
        { value: 'Chinchkhed Pr.Malkapur (चिंचखेड प्र.मलकापुर)', label: 'Chinchkhed Pr.Malkapur (चिंचखेड प्र.मलकापुर)' },
        { value: 'Dadgaon (दादगाव)', label: 'Dadgaon (दादगाव)' },
        { value: 'Dahigaon (दहिगांव)', label: 'Dahigaon (दहिगांव)' },
        { value: 'Dahivadi (दहीवडी)', label: 'Dahivadi (दहीवडी)' },
        { value: 'Dhadi (धाडी)', label: 'Dhadi (धाडी)' },
        { value: 'Dhanora Bk. (धानोरा बु.)', label: 'Dhanora Bk. (धानोरा बु.)' },
        { value: 'Dhanora Kh. (धानोरा खु.)', label: 'Dhanora Kh. (धानोरा खु.)' },
        { value: 'Dhanora Pr.Chandur (धानोरा प्र.चांदुर)', label: 'Dhanora Pr.Chandur (धानोरा प्र.चांदुर)' },
        { value: 'Dighi (डिघी)', label: 'Dighi (डिघी)' },
        { value: 'Dolkhed (डोलखेड)', label: 'Dolkhed (डोलखेड)' },
        { value: 'Fuli (फुली)', label: 'Fuli (फुली)' },
        { value: 'Ghordhadi (घोरधाडी)', label: 'Ghordhadi (घोरधाडी)' },
        { value: 'Gondhankhed (गोंधनखेड)', label: 'Gondhankhed (गोंधनखेड)' },
        { value: 'Gosing (गोसिंग)', label: 'Gosing (गोसिंग)' },
        { value: 'Hingana Ujad (हिंगणा उजाड)', label: 'Hingana Ujad (हिंगणा उजाड)' },
        { value: 'Hingane Gavhad (हिंगणे गव्हाड)', label: 'Hingane Gavhad (हिंगणे गव्हाड)' },
        { value: 'Hingna Bhota (हिंगणा भोटा)', label: 'Hingna Bhota (हिंगणा भोटा)' },
        { value: 'Hingne Dadgaon (हिंगणे दादगाव)', label: 'Hingne Dadgaon (हिंगणे दादगाव)' },
        { value: 'Hingne Isapur (हिंगणे इसापूर)', label: 'Hingne Isapur (हिंगणे इसापूर)' },
        { value: 'Isabpur (इसबपूर)', label: 'Isabpur (इसबपूर)' },
        { value: 'Isapur (इसापूर)', label: 'Isapur (इसापूर)' },
        { value: 'Isarkheda (इसरखेड)', label: 'Isarkheda (इसरखेड)' },
        { value: 'Jawala Bazar (जवळा बाजार)', label: 'Jawala Bazar (जवळा बाजार)' },
        { value: 'Jigaon (जिगांव)', label: 'Jigaon (जिगांव)' },
        { value: 'Kandari Bk. (कंडारी बु.)', label: 'Kandari Bk. (कंडारी बु.)' },
        { value: 'Kandari Kh. (कंडारी खु.)', label: 'Kandari Kh. (कंडारी खु.)' },
        { value: 'Kati (काटी)', label: 'Kati (काटी)' },
        { value: 'Kedar (केदार)', label: 'Kedar (केदार)' },
        { value: 'Khadadgaon (खडदगांव)', label: 'Khadadgaon (खडदगांव)' },
        { value: 'Khaira (खैरा)', label: 'Khaira (खैरा)' },
        { value: 'Khandala (खंडाळा)', label: 'Khandala (खंडाळा)' },
        { value: 'Kharkundi (खरकुंडी)', label: 'Kharkundi (खरकुंडी)' },
        { value: 'Khatkhed (खातखेड)', label: 'Khatkhed (खातखेड)' },
        { value: 'Khedgaon (खेडगांव)', label: 'Khedgaon (खेडगांव)' },
        { value: 'Kherda (खेर्डा)', label: 'Kherda (खेर्डा)' },
        { value: 'Khudavantpur (खुदावंतपूर)', label: 'Khudavantpur (खुदावंतपूर)' },
        { value: 'Khumgaon (खुमगांव)', label: 'Khumgaon (खुमगांव)' },
        { value: 'Kodarkhed (कोदरखेड)', label: 'Kodarkhed (कोदरखेड)' },
        { value: 'Kokalwadi (कोकलवाडी)', label: 'Kokalwadi (कोकलवाडी)' },
        { value: 'Kolasar (कोलासर)', label: 'Kolasar (कोलासर)' },
        { value: 'Lonwadi Pr.Nandura (लोणवडी प्र.नांदुरा)', label: 'Lonwadi Pr.Nandura (लोणवडी प्र.नांदुरा)' },
        { value: 'Mahalungi Pr.Wadner (महाळुंगी प्र. वडनेर)', label: 'Mahalungi Pr.Wadner (महाळुंगी प्र. वडनेर)' },
        { value: 'Mahamdpur (महम्मदपूर)', label: 'Mahamdpur (महम्मदपूर)' },
        { value: 'Malegaon Pr.P.Raja (माळेगांव प्र. पि. राजा)', label: 'Malegaon Pr.P.Raja (माळेगांव प्र. पि. राजा)' },
        { value: 'Mamulwadi (मामुलवाडी)', label: 'Mamulwadi (मामुलवाडी)' },
        { value: 'Matoda (माटोडा)', label: 'Matoda (माटोडा)' },
        { value: 'Mendhali (मेंढळी)', label: 'Mendhali (मेंढळी)' },
        { value: 'Modha (मोढा)', label: 'Modha (मोढा)' },
        { value: 'Mominabad (मोमीनाबाद)', label: 'Mominabad (मोमीनाबाद)' },
        { value: 'Muramba (मुरंबा)', label: 'Muramba (मुरंबा)' },
        { value: 'Naigaon (नायगांव)', label: 'Naigaon (नायगांव)' },
        { value: 'Nandura Bk. (नांदुरा बु.)', label: 'Nandura Bk. (नांदुरा बु.)' },
        { value: 'Nandura Kh. (नांदुरा खु.)', label: 'Nandura Kh. (नांदुरा खु.)' },
        { value: 'Narakhed (नारखेड)', label: 'Narakhed (नारखेड)' },
        { value: 'Narayanpur (नारायणपूर)', label: 'Narayanpur (नारायणपूर)' },
        { value: 'Nimgaon (निमगांव)', label: 'Nimgaon (निमगांव)' },
        { value: 'Palsoda (पलसोडा)', label: 'Palsoda (पलसोडा)' },
        { value: 'Patonda (पातोंडा)', label: 'Patonda (पातोंडा)' },
        { value: 'Pimpalkhuta Dhande (पिंपळखुटा धांडे)', label: 'Pimpalkhuta Dhande (पिंपळखुटा धांडे)' },
        { value: 'Pimpalkhuta Kh. (पिंपळखुटा खु.)', label: 'Pimpalkhuta Kh. (पिंपळखुटा खु.)' },
        { value: 'Pimpri Adhav (पिंप्री अढाव)', label: 'Pimpri Adhav (पिंप्री अढाव)' },
        { value: 'Pimprikoli (पिंप्री कोळी)', label: 'Pimprikoli (पिंप्री कोळी)' },
        { value: 'Pota (पोटा)', label: 'Pota (पोटा)' },
        { value: 'Potali (पोटळी)', label: 'Potali (पोटळी)' },
        { value: 'Rampur (रामपूर)', label: 'Rampur (रामपूर)' },
        { value: 'Rasulpur (रसुलपुर)', label: 'Rasulpur (रसुलपुर)' },
        { value: 'Rasulpur Pr.Raja (रसुलपूर प्र. राजा)', label: 'Rasulpur Pr.Raja (रसुलपूर प्र. राजा)' },
        { value: 'Roti (रोटी)', label: 'Roti (रोटी)' },
        { value: 'Sangawa (सांगवा)', label: 'Sangawa (सांगवा)' },
        { value: 'Sanpudi (सानपुडी)', label: 'Sanpudi (सानपुडी)' },
        { value: 'Sawargaon Chahu (सावरगांव चाहू)', label: 'Sawargaon Chahu (सावरगांव चाहू)' },
        { value: 'Sawargaon Nehu (सावरगांव नेहू)', label: 'Sawargaon Nehu (सावरगांव नेहू)' },
        { value: 'Shelgaon Mukund (शेलगांव मुकुंद)', label: 'Shelgaon Mukund (शेलगांव मुकुंद)' },
        { value: 'Shemba Bk. (शेंबा बु.)', label: 'Shemba Bk. (शेंबा बु.)' },
        { value: 'Shemba Kh. (शेंबा खु.)', label: 'Shemba Kh. (शेंबा खु.)' },
        { value: 'Sirsodi (सिरसोडी)', label: 'Sirsodi (सिरसोडी)' },
        { value: 'Taka (टाका)', label: 'Taka (टाका)' },
        { value: 'Takarkhed (टाकरखेड)', label: 'Takarkhed (टाकरखेड)' },
        { value: 'Takli (Watpal) (टाकळी (वटपाळ))', label: 'Takli (Watpal) (टाकळी (वटपाळ))' },
        { value: 'Tandulwadi Pr.Rajur (तांदुळवाडी प्र.राजुर)', label: 'Tandulwadi Pr.Rajur (तांदुळवाडी प्र.राजुर)' },
        { value: 'Tarwadi (तरवाडी)', label: 'Tarwadi (तरवाडी)' },
        { value: 'Tikodi (तिकोडी)', label: 'Tikodi (तिकोडी)' },
        { value: 'Udaypur (उदयपूर)', label: 'Udaypur (उदयपूर)' },
        { value: 'Vitali (विटाळी)', label: 'Vitali (विटाळी)' },
        { value: 'Wadali (वडाळी)', label: 'Wadali (वडाळी)' },
        { value: 'Wadgaon Dighi (वडगांव डिघी)', label: 'Wadgaon Dighi (वडगांव डिघी)' },
        { value: 'Wadgaon Pr.Raja (वडगांव प्र. राजा)', label: 'Wadgaon Pr.Raja (वडगांव प्र. राजा)' },
        { value: 'Wadi Pr.Malkapur (वाडी प्र.मलकापूर)', label: 'Wadi Pr.Malkapur (वाडी प्र.मलकापूर)' },
        { value: 'Wadi Pr.Wadner (वाडी प्र. वडनेर)', label: 'Wadi Pr.Wadner (वाडी प्र. वडनेर)' },
        { value: 'Wadner Bhag 1 (वडनेर भाग 1)', label: 'Wadner Bhag 1 (वडनेर भाग 1)' },
        { value: 'Wadner Bhag 2 (वडनेर भाग 2)', label: 'Wadner Bhag 2 (वडनेर भाग 2)' },
        { value: 'Walti Bk. (वळती बु.)', label: 'Walti Bk. (वळती बु.)' },
        { value: 'Walti Kh. (वळती खु.)', label: 'Walti Kh. (वळती खु.)' },
        { value: 'Wasadi Bk. (वसाडी बु.)', label: 'Wasadi Bk. (वसाडी बु.)' },
        { value: 'Wasadi Kh. (वसाडी खु.)', label: 'Wasadi Kh. (वसाडी खु.)' },
        { value: 'Yerali (येरळी)', label: 'Yerali (येरळी)' }

      ]

      const JalgaonJamnerOptions = [
        
        { value: 'Ambadi (अंबाडी)', label: 'Ambadi (अंबाडी)' },
        { value: 'Ambilhol (आंबिलहोल)', label: 'Ambilhol (आंबिलहोल)' },
        { value: 'Ambilhol Devi (आंबिलहोल देवी)', label: 'Ambilhol Devi (आंबिलहोल देवी)' },
        { value: 'Amkhede (अमखेडे)', label: 'Amkhede (अमखेडे)' },
        { value: 'Betawad Bk (बेटावद बु.)', label: 'Betawad Bk (बेटावद बु.)' },
        { value: 'Betawad Kh (बेटावद खु.)', label: 'Betawad Kh (बेटावद खु.)' },
        { value: 'Bhagdare (भागदरे)', label: 'Bhagdare (भागदरे)' },
        { value: 'Bharadi (भराडी)', label: 'Bharadi (भराडी)' },
        { value: 'Bharudkhede (भारूडखेडे)', label: 'Bharudkhede (भारूडखेडे)' },
        { value: 'Bhilkheda (भिलखेडा)', label: 'Bhilkheda (भिलखेडा)' },
        { value: 'Bilwadi (बिलवाडी)', label: 'Bilwadi (बिलवाडी)' },
        { value: 'Borgaon (बोरगाव)', label: 'Borgaon (बोरगाव)' },
        { value: 'Chilgaon (चीलगाव)', label: 'Chilgaon (चीलगाव)' },
        { value: 'Chinchakhede Bk (चिंचखेडे बु.)', label: 'Chinchakhede Bk (चिंचखेडे बु.)' },
        { value: 'Chinchkhede Digar (चिंचखेडे दिगर)', label: 'Chinchkhede Digar (चिंचखेडे दिगर)' },
        { value: 'Chinchkhede Tawa (चिंचखेडे तवा)', label: 'Chinchkhede Tawa (चिंचखेडे तवा)' },
        { value: 'Chincholi Pimpri (चिंचोली पिंप्री)', label: 'Chincholi Pimpri (चिंचोली पिंप्री)' },
        { value: 'Deulgaon (देऊळगाव)', label: 'Deulgaon (देऊळगाव)' },
        { value: 'Dev Pimpri (देव पिंप्री)', label: 'Dev Pimpri (देव पिंप्री)' },
        { value: 'Devalasgaon (देवळसगांव)', label: 'Devalasgaon (देवळसगांव)' },
        { value: 'Dhalgaon (ढालगाव)', label: 'Dhalgaon (ढालगाव)' },
        { value: 'Dhalsingi (ढालसिंगी)', label: 'Dhalsingi (ढालसिंगी)' },
        { value: 'Dohari (डोहरी)', label: 'Dohari (डोहरी)' },
        { value: 'Dondwade (दोंदवाडे)', label: 'Dondwade (दोंदवाडे)' },
        { value: 'Ekulti Bk. (एकुलती बु.)', label: 'Ekulti Bk. (एकुलती बु.)' },
        { value: 'Ekulti Kh (एकुलती खु.)', label: 'Ekulti Kh (एकुलती खु.)' },
        { value: 'Gadegaon Pn Nashirabad (गाडेगाव प्र.न नशिराबाद)', label: 'Gadegaon Pn Nashirabad (गाडेगाव प्र.न नशिराबाद)' },
        { value: 'Ganeshpur (गणेशपुर)', label: 'Ganeshpur (गणेशपुर)' },
        { value: 'Gangapuri (गंगापुरी)', label: 'Gangapuri (गंगापुरी)' },
        { value: 'Garkhede Bk (गारखेडे बु.)', label: 'Garkhede Bk (गारखेडे बु.)' },
        { value: 'Garkhede Kh (गारखेडे खु.)', label: 'Garkhede Kh (गारखेडे खु.)' },
        { value: 'Godri (गोद्री)', label: 'Godri (गोद्री)' },
        { value: 'Gondegaon (गोंदेगाव)', label: 'Gondegaon (गोंदेगाव)' },
        { value: 'Gondkhed (गोंडखेड)', label: 'Gondkhed (गोंडखेड)' },
        { value: 'Gorad Khede (गोरड खेडे)', label: 'Gorad Khede (गोरड खेडे)' },
        { value: "Gornale (गोरनाळे)", label: "Gornale (गोरनाळे)" },
        { value: "Harinagar (हरीनगर)", label: "Harinagar (हरीनगर)" },
        { value: "Hingane Bk (हिंगणे बु.)", label: "Hingane Bk (हिंगणे बु.)" },
        { value: "Hingane N.Kasab (हिंगणे न.कसब)", label: "Hingane N.Kasab (हिंगणे न.कसब)" },
        { value: "Hingane Pimpri (हिंगणे पिंप्री)", label: "Hingane Pimpri (हिंगणे पिंप्री)" },
        { value: "Hivar Khede Bk. (हिवर खेडे बु.)", label: "Hivar Khede Bk. (हिवर खेडे बु.)" },
        { value: "Hivari Digar (हिवरी दिगर)", label: "Hivari Digar (हिवरी दिगर)" },
        { value: "Hivarkhede Digar (हिवरखेडे दिगर)", label: "Hivarkhede Digar (हिवरखेडे दिगर)" },
        { value: "Hivarkhede Tawa (हिवरखेडे तवा)", label: "Hivarkhede Tawa (हिवरखेडे तवा)" },
        { value: "Holhaveli (होळ हवेली)", label: "Holhaveli (होळ हवेली)" },
        { value: "Jalandri Bk. (जळांद्री बु.)", label: "Jalandri Bk. (जळांद्री बु.)" },
        { value: "Jalandri Kh. (जळांद्री खु.)", label: "Jalandri Kh. (जळांद्री खु.)" },
        { value: "Jambhol (जांभोळ)", label: "Jambhol (जांभोळ)" },
        { value: "Jamner (जामनेर)", label: "Jamner (जामनेर)" },
        { value: "Jangipura (जंगीपुरा)", label: "Jangipura (जंगीपुरा)" },
        { value: "Jogal Khede (जोगल खेडे)", label: "Jogal Khede (जोगल खेडे)" },
        { value: "Junone (जुनोने)", label: "Junone (जुनोने)" },
        { value: "Kalkhede (काळखेडे)", label: "Kalkhede (काळखेडे)" },
        { value: "Kapuswadi (कापूसवाडी)", label: "Kapuswadi (कापूसवाडी)" },
        { value: "Karmad (करमाड)", label: "Karmad (करमाड)" },
        { value: "Karnafata (कर्णफाटा)", label: "Karnafata (कर्णफाटा)" },
        { value: "Kasali (कासली)", label: "Kasali (कासली)" },
        { value: "Kasba Pimpri (कसबा पिंप्री)", label: "Kasba Pimpri (कसबा पिंप्री)" },
        { value: "Kekat Nimbora (केकत निंभोरा)", label: "Kekat Nimbora (केकत निंभोरा)" },
        { value: "Khadgaon (खादगाव)", label: "Khadgaon (खादगाव)" },
        { value: "Khadki (खडकी)", label: "Khadki (खडकी)" },
        { value: "Khandave (खांडवे)", label: "Khandave (खांडवे)" },
        { value: "Kharchane (खर्चाने)", label: "Kharchane (खर्चाने)" },
        { value: "Kinhi (किन्ही)", label: "Kinhi (किन्ही)" },
        { value: "Kodoli . (कोदोली)", label: "Kodoli (कोदोली)" },
        { value: 'Kumbari Kh (कुंभारी खु.)', label: 'Kumbari Kh (कुंभारी खु.)' },
        { value: 'Kumbhari Bk. (कुंभारी बु.)', label: 'Kumbhari Bk. (कुंभारी बु.)' },
        { value: 'Kumbhari Sim (कुंभारी सिम)', label: 'Kumbhari Sim (कुंभारी सिम)' },
        { value: 'Lahasar (लहासर)', label: 'Lahasar (लहासर)' },
        { value: 'Lakholi (लाखोली)', label: 'Lakholi (लाखोली)' },
        { value: 'Lihe (लिहे)', label: 'Lihe (लिहे)' },
        { value: 'Londhri Bk. (लोंढरी बु.)', label: 'Londhri Bk. (लोंढरी बु.)' },
        { value: 'Londhri Kh. (लोंढरी खु.)', label: 'Londhri Kh. (लोंढरी खु.)' },
        { value: 'Loni (लोणी)', label: 'Loni (लोणी)' },
        { value: 'Madani (मादणी)', label: 'Madani (मादणी)' },
        { value: 'Mahukhede (महुखेडे)', label: 'Mahukhede (महुखेडे)' },
        { value: 'Maldhabadi (मालदाभाडी)', label: 'Maldhabadi (मालदाभाडी)' },
        { value: 'Malkheda (मालखेडा)', label: 'Malkheda (मालखेडा)' },
        { value: 'Malpimpri (माळपिंप्री)', label: 'Malpimpri (माळपिंप्री)' },
        { value: 'Mandave Bk. (मांडावे बु.)', label: 'Mandave Bk. (मांडावे बु.)' },
        { value: 'Mandave Kh. (मांडावे खु.)', label: 'Mandave Kh. (मांडावे खु.)' },
        { value: 'Mehegaon (मेहेगाव)', label: 'Mehegaon (मेहेगाव)' },
        { value: 'Mengaon (मेणगाव)', label: 'Mengaon (मेणगाव)' },
        { value: 'Mohadi (मोहाडी)', label: 'Mohadi (मोहाडी)' },
        { value: 'Morad Digar (मोराड दिगर)', label: 'Morad Digar (मोराड दिगर)' },
        { value: 'Moygaon Bk (मोयगाव बु.)', label: 'Moygaon Bk (मोयगाव बु.)' },
        { value: 'Moykhede Digar (मोयखेडा दिगर)', label: 'Moykhede Digar (मोयखेडा दिगर)' },
        { value: 'Mundkhede (मुंद्खेडे)', label: 'Mundkhede (मुंद्खेडे)' },
        { value: 'Nachan Khede (नाचण खेडे)', label: 'Nachan Khede (नाचण खेडे)' },
        { value: 'Nagan Kh . (नागण खु.)', label: 'Nagan Kh . (नागण खु.)' },
        { value: 'Nandre Haveli (नांद्रे हवेली)', label: 'Nandre Haveli (नांद्रे हवेली)' },
        { value: 'Nandre Pr.Lohare (नांद्रे प्र.लोहारे)', label: 'Nandre Pr.Lohare (नांद्रे प्र.लोहारे)' },
        { value: 'Navidabhadi (नवीदाभाडी)', label: 'Navidabhadi (नवीदाभाडी)' },
        { value: 'Neri Bk. (नेरी बु.)', label: 'Neri Bk. (नेरी बु.)' },
        { value: 'Neri Digar (नेरी दिगर)', label: 'Neri Digar (नेरी दिगर)' },
        { value: 'Nimkhedi Pimpri (निमखेडी पिंप्री)', label: 'Nimkhedi Pimpri (निमखेडी पिंप्री)' },
        { value: 'Ozar Bk. (ओझर बु.)', label: 'Ozar Bk. (ओझर बु.)' },
        { value: 'Ozar Kh. (ओझर खु.)', label: 'Ozar Kh. (ओझर खु.)' },
        { value: 'Pahur (पहूर)', label: 'Pahur (पहूर)' },
        { value: 'Palas Khede Bk. (पळस खेडे बु.)', label: 'Palas Khede Bk. (पळस खेडे बु.)' },
        { value: 'Palas Khede Kakar (पळस खेडे काकर)', label: 'Palas Khede Kakar (पळस खेडे काकर)' },
        { value: "Palasakhede.Pr.Na (पळासखेडे प्र.न.)", label: "Palasakhede.Pr.Na (पळासखेडे प्र.न.)" },
        { value: "Paldhi (पाळधी)", label: "Paldhi (पाळधी)" },
        { value: "Pathad Tanda (पठाड तांडा)", label: "Pathad Tanda (पठाड तांडा)" },
        { value: "Patkheda (पाटखेडा)", label: "Patkheda (पाटखेडा)" },
        { value: "Phattepur (फत्तेपूर)", label: "Phattepur (फत्तेपूर)" },
        { value: "Pimpalgaon Bk. (पिंपळगाव बु.)", label: "Pimpalgaon Bk. (पिंपळगाव बु.)" },
        { value: "Pimpalgaon Golait (पिंपळगाव गोलाईत)", label: "Pimpalgaon Golait (पिंपळगाव गोलाईत)" },
        { value: "Pimpalgaon Kamani (पिंपळगाव कमानी)", label: "Pimpalgaon Kamani (पिंपळगाव कमानी)" },
        { value: "Pimpalgaon Kh. (पिंपळगाव खु.)", label: "Pimpalgaon Kh. (पिंपळगाव खु.)" },
        { value: "Pimpalgaon Pimpri (पिंपळगाव पिंप्री)", label: "Pimpalgaon Pimpri (पिंपळगाव पिंप्री)" },
        { value: "Pimpar Khede (पिंपरखेडे)", label: "Pimpar Khede (पिंपरखेडे)" },
        { value: "Rahere (राहेरे)", label: "Rahere (राहेरे)" },
        { value: "Rajani (रांजणी)", label: "Rajani (रांजणी)" },
        { value: "Rampur (रामपूर)", label: "Rampur (रामपूर)" },
        { value: "Rampura (रामपुरा)", label: "Rampura (रामपुरा)" },
        { value: "Rotwad (रोटवद)", label: "Rotwad (रोटवद)" },
        { value: "Samrod (सामरोद)", label: "Samrod (सामरोद)" },
        { value: "Sangavi (सांगवी)", label: "Sangavi (सांगवी)" },
        { value: "Sargaon (सारगाव)", label: "Sargaon (सारगाव)" },
        { value: "Sarve Pr.Lohare (सर्वे प्र.लोहारे)", label: "Sarve Pr.Lohare (सर्वे प्र.लोहारे)" },
        { value: "Savarle (सावरले)", label: "Savarle (सावरले)" },
        { value: "Savatkhede (सवतखेडे)", label: "Savatkhede (सवतखेडे)" },
        { value: "Shahapur (शहापूर)", label: "Shahapur (शहापूर)" },
        { value: "Shankarpura (शंकरपुरा)", label: "Shankarpura (शंकरपुरा)" },
        { value: "Shelgaon (शेळगाव)", label: "Shelgaon (शेळगाव)" },
        { value: "Shendurni (शेंदुर्णी)", label: "Shendurni (शेंदुर्णी)" },
        { value: "Shengola (शेंगोळा)", label: "Shengola (शेंगोळा)" },
        { value: "Sheri (शेरी)", label: "Sheri (शेरी)" },
        { value: "Shevage Pimpri (शेवगे पिंप्री)", label: "Shevage Pimpri (शेवगे पिंप्री)" },
        { value: "Shingaiet (शिंगाईत)", label: "Shingaiet (शिंगाईत)" },
        { value: "Sonale (सोनाळे)", label: "Sonale (सोनाळे)" },
        { value: "Sonari (सोनारी)", label: "Sonari (सोनारी)" },
        { value: "Sunasgaon Bk. (सुनसगाव बु.)", label: "Sunasgaon Bk. (सुनसगाव बु.)"},
        { value: "Sunasgaon Kh. (सुनसगाव खु.)", label: "Sunasgaon Kh. (सुनसगाव खु.)"},
        { value: 'Takali Bk. (टाकळी बु.)', label: 'Takali Bk. (टाकळी बु.)' },
        { value: 'Takali Kh. (टाकळी खु.)', label: 'Takali Kh. (टाकळी खु.)' },
        { value: 'Takali Pimpri (टाकळी पिंप्री)', label: 'Takali Pimpri (टाकळी पिंप्री)' },
        { value: 'Takarkhede (टाकरखेडे)', label: 'Takarkhede (टाकरखेडे)' },
        { value: 'Talegaon (तळेगाव)', label: 'Talegaon (तळेगाव)' },
        { value: 'Tarangwadi (तरंगवाडी)', label: 'Tarangwadi (तरंगवाडी)' },
        { value: 'Tighre Wadgaon (तिघ्रे वडगाव)', label: 'Tighre Wadgaon (तिघ्रे वडगाव)' },
        { value: 'Tondapur (तोंडापूर)', label: 'Tondapur (तोंडापूर)' },
        { value: 'Tornale (तोरनाळे)', label: 'Tornale (तोरनाळे)' },
        { value: 'Vasantnagar (वसंतनगर)', label: 'Vasantnagar (वसंतनगर)' },
        { value: 'Wadali (वडाळी)', label: 'Wadali (वडाळी)' },
        { value: 'Wadgaon Bk. (वडगाव बु.)', label: 'Wadgaon Bk. (वडगाव बु.)' },
        { value: 'Wadgaon Nimb (वडगाव निंब)', label: 'Wadgaon Nimb (वडगाव निंब)' },
        { value: 'Wadgaon Saddo (वडगाव सद्दो)', label: 'Wadgaon Saddo (वडगाव सद्दो)' },
        { value: 'Wadgaon Tighre (वडगाव तिघ्रे)', label: 'Wadgaon Tighre (वडगाव तिघ्रे)' },
        { value: 'Wadi (वाडी)', label: 'Wadi (वाडी)' },
        { value: 'Waghari (वाघारी)', label: 'Waghari (वाघारी)' },
        { value: 'Wakadi (वाकडी)', label: 'Wakadi (वाकडी)' },
        { value: 'Waki Bk. (वाकी बु.)', label: 'Waki Bk. (वाकी बु.)' },
        { value: 'Waki Kh. (वाकी खु.)', label: 'Waki Kh. (वाकी खु.)' },
        { value: 'Wakod (वाकोद)', label: 'Wakod (वाकोद)' }
      ]

      const PuneAmbegaonOptions =[
        {value: "Adivare", label: "अडिवरे"},
        {value: "Aghane", label: "आघाणे"},
        {value: "Ahupe", label: "आहुपे"},
        {value: "Amade", label: "आमडे"},
        {value: "Ambedara", label: "आंबेदरा"},
        {value: "Ambegaon", label: "आंबेगाव"},
        {value: "Amondi", label: "आमोंडी"},
        {value: "Apati", label: "आपटी"},
        {value: "Asane", label: "आसाणे"},
        {value: "Awasari Bk.", label: "अवसरी बु."},
        {value: "Awasari Kh", label: "अवसरी खु.."},
        {value: "Babhulwadi", label: "बाभुळवाडी"},
        {value: "Bhagadi", label: "भागडी"},
        {value: "Bharadi", label: "भराडी"},
        {value: "Bhawadi", label: "भावडी"},
        {value: "Bhorwadi", label: "भोरवाडी"},
        {value: "Borghar", label: "बोरघर"},
        {value: "Chandoli Bk.", label: "चांडोली बु."},
        {value: "Chandoli Kh.", label: "चांडोली खु."},
        {value: "Chas", label: "चास"},
        {value: "Chikhali", label: "चिखली"},
        {value: "Chinchodi", label: "चिंचोडी"},
        {value: "Chincholi", label: "चिंचोली"},
        {value: "Devgaon", label: "देवगाव"},
        {value: "Dhakale", label: "ढाकाळे"},
        {value: "Dhamani", label: "धामणी"},
        {value: "Dhondmal Shindewadi", label: "धाडमल शिंदेवाडी"},
        {value: "Digad", label: "दिगद"},
        {value: "Dimbhe Bk.", label: "डिंभे बु."},
        {value: "Dimbhe Kh.", label: "डिंभे खु."},
        {value: "Don", label: "डोण"},
        {value: "Eklahare", label: "एकलहरे"},
        {value: "Falakewadi", label: "फलकेवाडी"},
        {value: "Gadewadi", label: "गाडेवाडी"},
        {value: "Gangapur Bk.", label: "गंगापूर बु."},
        {value: "Gangapur Kh.", label: "गंगापूर खु."},
        {value: "Gavdewadi", label: "गावडेवाडी"},
        {value: "Gawarwadi", label: "गवरवाडी"},
        {value: "Ghodegaon", label: "घोडेगाव"},
        {value: "Girawali", label: "गिरवली"},
        {value: "Gohe Bk.", label: "गोहे बु."},
        {value: "Gohe Kh.", label: "गोहे खु."},
        {value: "Jadhavwadi", label: "जाधववाडी"},
        {value: "Jambhori", label: "जांभोरी"},
        {value: "Jarkarwadi", label: "जारकरवाडी"},
        {value: "Jawale", label: "जवळे"},
        {value: "Kadewadi", label: "कडेवाडी"},
        {value: "Kalamb", label: "कळंब"},
        {value: "Kalambai", label: "कळंबई"},
        {value: "Kalewadi Darekarwadi", label: "काळेवाडी दरेकरवाडी"},
        {value: "Kanase", label: "कानसे"},
        {value: "Karegaon", label: "कारेगाव"},
        {value: "Kathapur Bk.", label: "काठापूर बु."},
        {value: "Khadakamala", label: "खडकमळा"},
        {value: "Khadaki", label: "खडकी"},
        {value: "Khadakwadi", label: "खडकवाडी"},
        {value: "Koldara Gonawadi", label: "कोलदरा गोनवाडी"},
        {value: "Kolharwadi", label: "कोल्हारवाडी"},
        {value: "Koltavade", label: "कोलतावडे"},
        {value: "Kolwadi Kotamdara", label: "कोळवाडी कोटमदरा"},
        {value: "Kondhare", label: "कोंढरे"},
        {value: "Kondhaval", label: "कोंढवळ"},
        {value: "Kurwandi", label: "कुरवंडी"},
        { value: 'Kurwandi', label: 'कुरवंडी' },
        { value: 'Kushire Bk.', label: 'कुशिरे बु.' },
        { value: 'Kushire Kh.', label: 'कुशिरे खु.' },
        { value: 'Lakhangaon', label: 'लाखनगाव' },
        { value: 'Loni', label: 'लोणी' },
        { value: 'Louki', label: 'लौकी' },
        { value: 'Mahalunge Padawal', label: 'म्हाळुंगे पडवळ' },
        { value: 'Mahalunge Tarf Ambegaon', label: 'म्हाळुंगे तर्फे आंबेगाव' },
        { value: 'Mahalunge Tarf Ghoda', label: 'म्हाळुंगे तर्फ घोडा' },
        { value: 'Malin', label: 'माळीण' },
        { value: 'Manchar', label: 'मंचर' },
        { value: 'Mandalewadi', label: 'मांदळेवाडी' },
        { value: 'Mapoli', label: 'मापोली' },
        { value: 'Megholi', label: 'मेघोली' },
        { value: 'Mengadewadi', label: 'मेंगडेवाडी' },
        { value: 'Menumbarwadi', label: 'मेनुंबरवाडी' },
        { value: 'Mordewadi', label: 'मोरडेवाडी' },
        { value: 'Nagapur', label: 'नागापूर' },
        { value: 'Nanavade', label: 'नानवडे' },
        { value: 'Nandur', label: 'नांदूर' },
        { value: 'Nandurkichi Wadi', label: 'नांदुरकीची वाडी' },
        { value: 'Narodi', label: 'नारोडी' },
        { value: 'Nhaved', label: 'न्हावेड' },
        { value: 'Nigdale', label: 'निगडाळे' },
        { value: 'Nighotwadi', label: 'निघोटवाडी' },
        { value: 'Nirgoodsar', label: 'निरगुडसर' },
        { value: 'Pahaddara', label: 'पहाडदरा' },
        { value: 'Panchale Bk.', label: 'पंचाळे बु.' },
        { value: 'Panchale Kh.', label: 'पंचाळे खु.' },
        { value: 'Pargaon Tarf Awasari Bk.', label: 'पारगाव तर्फे अवसरी बु.' },
        { value: 'Pargaon Tarf Khed', label: 'पारगाव तर्फ खेड' },
        { value: 'Patan', label: 'पाटण' },
        { value: 'Peth', label: 'पेठ' },
        { value: 'Phadalewadi Ugalewadi', label: 'फदालेवाडी उगलेवाडी' },
        { value: 'Phalode', label: 'फलोदे' },
        { value: 'Phulawade', label: 'फुलवडे' },
        { value: 'Pimpalgaon Tarf Ghoda', label: 'पिंपळगाव तर्फं घोडा' },
        { value: 'Pimpalgaon Tarf Mahalunge', label: 'पिंपळगाव तर्फे महाळुंगे' },
        { value: 'Pimpargane', label: 'पिंपरगणे' },
        { value: 'Pimpari', label: 'पिंपरी' },
        { value: 'Pinglewadi Landewadi', label: 'पिंगळवाडी लांडेवाडी' },
        { value: 'Pokhari', label: 'पोखरी' },
        { value: 'Pokharkarwadi', label: 'पोखरकरवाडी' },
        { value: 'Pondewadi', label: 'पोंदेवाडी' },
        { value: 'Rajewadi', label: 'राजेवाडी' },
        { value: 'Rajpur', label: 'राजपुर' },
        { value: 'Ramwadi', label: 'रामवाडी' },
        { value: 'Ranjani', label: 'रांजणी' },
        { value: 'Ranmala', label: 'रानमळा' },
        { value: 'Sakeri', label: 'साकेरी' },
        { value: 'Sakore', label: 'साकोरे' },
        { value: 'Sal', label: 'साल' },
        { value: 'Savarli', label: 'सावरली' },
        { value: 'Shewalwadi', label: 'शेवाळवाडी' },
        { value: 'Shewalwadi Landewadi', label: 'शेवाळवाडी लांडेवाडी' },
        { value: 'Shindemala', label: 'शिंदेमळा' },
        { value: 'Shingave', label: 'शिंगवे' },
        { value: 'Shinoli', label: 'शिनोली' },
        { value: 'Shirdale', label: 'शिरदाळे' },
        { value: 'Shriramnagar', label: 'श्रीरामनगर' },
        { value: 'Sultanpur', label: 'सुलतानपुर' },
        { value: 'Supedhar', label: 'सुपेधर' },
        { value: 'Takewadi', label: 'टाकेवाडी' },
        { value: 'Taleghar', label: 'तळेघर' },
        { value: 'Talekarwadi', label: 'तळेकरवाडी' },
        { value: 'Tambademala', label: 'तांबंडेमळा' },
        { value: 'Tavharewadi', label: 'टाव्हरेवाडी' },
        { value: 'Terungan', label: 'तेरूंगण' },
        { value: 'Thakar Wadi', label: 'ठाकर वाडी' },
        { value: 'Thorandale', label: 'थोरांदळे' },
        { value: 'Thugaon', label: 'थुगांव' },
        { value: 'Tirpad', label: 'तिरपाड' },
        { value: 'Vachape', label: 'वचपे' },
        { value: 'Vadgaon Kashimbeg', label: 'वडगाव काशिंबेग' },
        { value: 'Varasawane', label: 'वरसावणे' },
        { value: 'Vayalmala', label: 'वायाळमळा' },
        { value: 'Vitthalwadi', label: 'विठठलवाडी' },
        { value: 'Wadgaon Pir', label: 'वडगाव पीर' },
        { value: 'Walati', label: 'वळती' },
        { value: 'Walunjnagar', label: 'वाळूंजनगर' },
        { value: 'Walunjwadi', label: 'वाळुंजवाडी' }
      ]

      const PuneIndapurOptions = [
        { value: 'Agoti No.1', label: 'आगोती नं. 1' },
        { value: 'Agoti No.2', label: 'आगोती नं. 2' },
        { value: 'Ajoti', label: 'अजोती' },
        { value: 'Akole', label: 'अकोले' },
        { value: 'Anandnagar', label: 'आनंदनगर' },
        { value: 'Anthurne', label: 'अंथुर्णे' },
        { value: 'Awasari', label: 'अवसरी' },
        { value: 'Babhulgaon', label: 'बाभुळगाव' },
        { value: 'Balpudi', label: 'बळपूडी' },
        { value: 'Bandewadi', label: 'बांडेवाडी' },
        { value: 'Bandgarwadi', label: 'बंडगारवाडी' },
        { value: 'Bawada', label: 'बावडा' },
        { value: 'Bedshinge', label: 'बेडशिंगे' },
        { value: 'Belawadi', label: 'बेलवाडी' },
        { value: 'Bhadalwadi', label: 'भादलवाडी' },
        { value: 'Bhandgaon', label: 'भांडगांव' },
        { value: 'Bharnewadi', label: 'भरणेवाडी' },
        { value: 'Bhat Nimgaon', label: 'भाट निमगांव' },
        { value: 'Bhawadi', label: 'भावडी' },
        { value: 'Bhawaninagar', label: 'भवानीनगर' },
        { value: 'Bhigvan', label: 'भिगवण' },
        { value: 'Bhodani', label: 'भोडणी' },
        { value: 'Bijwadi', label: 'बिजवडी' },
        { value: 'Birgundwadi', label: 'बिरंगुडवाडी' },
        { value: 'Boratwadi', label: 'बोराटवाडी' },
        { value: 'Bori', label: 'बोरी' },
        { value: 'Chakati', label: 'चाकाटी' },
        { value: 'Chandgaon', label: 'चांडगांव' },
        { value: 'Chavhanwadi', label: 'चव्हाणवाडी' },
        { value: 'Chikhali', label: 'चिखली' },
        { value: 'Dalaj No.1', label: 'डाळज नं 1' },
        { value: 'Dalaj No.2', label: 'डाळज नं 2' },
        { value: 'Dalaj No.3', label: 'डाळज नं 3' },
        { value: 'Dikasal', label: 'डिकसळ' },
        { value: 'Gagargaon', label: 'गागरगांव' },
        { value: 'Galand Wadi No.1', label: 'गलांडवाडी नं 1' },
        { value: 'Galand Wadi No.2', label: 'गलांडवाडी नं 2' },
        { value: 'Ganeshwadi', label: 'गणेशवाडी' },
        { value: 'Ganjewalan', label: 'गांजेवळण' },
        { value: 'Ghorpadwadi', label: 'घोरपडवाडी' },
        { value: 'Giravi', label: 'गिरवी' },
        { value: 'Gokhali', label: 'गोखळी' },
        { value: 'Gondi', label: 'गोंदी' },
        { value: 'Gosaviwadi', label: 'गोसावीवाडी' },
        { value: 'Gotondi', label: 'गोतोंडी' },
        { value: 'Hagarewadi', label: 'हगारेवाडी' },
        { value: 'Hinganewadi', label: 'हिंगणेवाडी' },
        { value: 'Hingangaon', label: 'हिंगणगांव' },
        { value: 'Indapur', label: 'इंदापूर' },
        { value: 'Jachakvasti', label: 'जाचकवस्ती' },
        { value: 'Jadhavwadi', label: 'जाधववाडी' },
        { value: 'Jamb', label: 'जांब' },
        { value: 'Jankshan', label: 'जंक्शन' },
        { value: 'Kacharwadi (N.K)', label: 'कचरवाडी (नि .के)' },
        { value: 'Kacharwadi Bawada', label: 'कचरवाडी बावडा' },
        { value: 'Kadbanwadi', label: 'कडबनवाडी' },
        { value: 'Kalamb', label: 'कळंब' },
        { value: 'Kalas', label: 'कळस' },
        { value: 'Kalashi', label: 'कळाशी' },
        { value: 'Kalewadi', label: 'काळेवाडी' },
        { value: 'Kalthan No.1', label: 'कालठण नं.1' },
        { value: 'Kalthan No.2', label: 'कालठण नं.2' },
        { value: 'Kandalgaon', label: 'कांदलगाव' },
        { value: 'Kardanwadi', label: 'कर्दनवाडी' },
        { value: 'Karewadi', label: 'करेवाडी' },
        { value: 'Kati', label: 'काटी' },
        { value: 'Kauthali', label: 'कौठळी' },
        { value: 'Kazad', label: 'काझड' },
        { value: 'Khorochi', label: 'खोरोची' },
        { value: 'Kumbhargaon', label: 'कुंभारगांव' },
        { value: 'Kurawali', label: 'कुरवली' },
        { value: 'Lakadi', label: 'लाकडी' },
        { value: 'Lakhewadi', label: 'लाखेवाडी' },
        { value: 'Lamjewadi', label: 'लामजेवाडी' },
        { value: 'Lasurne', label: 'लासुर्णे' },
        { value: 'Loni Deokar', label: 'लोणी देवकर' },
        { value: 'Lumewadi', label: 'लुमेवाडी' },
        { value: 'Madanwadi', label: 'मदनवाडी' },
        { value: 'Malewadi(Palasdeo)', label: 'माळेवाडी (पळसदेव)' },
        { value: 'Malwadi', label: 'माळवाडी' },
        { value: 'Mankarwadi', label: 'मानकरवाडी' },
        { value: 'Maradewadi', label: 'मराडेवाडी' },
        { value: 'Mhasobachiwadi', label: 'म्हसोबाचीवाडी' },
        { value: 'Narsingpur', label: 'नरसिंहपूर' },
        { value: 'Narutwadi', label: 'नरुटवाडी' },
        { value: 'Nhavi', label: 'न्हावी' },
        { value: 'Nimbodi', label: 'निंबोडी' },
        { value: 'Nimgaon Ketki', label: 'निमगाव केतकी' },
        { value: 'Nimsakhar', label: 'निमसाख़र' },
        { value: 'Nirgude', label: 'निरगुडे' },
        { value: 'Nirnimgaon', label: 'निरनिमगाव' },
        { value: 'Nirwangi', label: 'निरवांगी' },
        { value: 'Ozare', label: 'ओझरे' },
        { value: 'Padasthal', label: 'पडस्थळ' },
        { value: 'Palasdeo', label: 'पळसदेव' },
        { value: 'Pandharwadi', label: 'पंधारवाडी' },
        { value: 'Paritwadi', label: 'परीटवाडी' },
        { value: 'Pawarwadi', label: 'पवारवाडी' },
        { value: 'Pilewadi', label: 'पिलेवाडी' },
        { value: 'Pimpale', label: 'पिंपळे' },
        { value: 'Pimpri Bk.', label: 'पिंपरी बु.' },
        { value: 'Pimpri Kh.', label: 'पिंपरी खु.' },
        { value: 'Pithewadi', label: 'पिठेवाडी' },
        { value: 'Pitkeshwar', label: 'पिटकेश्वर' },
        { value: 'Pondkulwadi', label: 'पोंदकुलवाडी' },
        { value: 'Pondwadi', label: 'पोंधवडी' },
        { value: 'Rajwadi', label: 'राजवडी' },
        { value: 'Ranmodwadi', label: 'रणमोडवाडी' },
        { value: 'Reda', label: 'रेडा' },
        { value: 'Redani', label: 'रेडणी' },
        { value: 'Rui', label: 'रुई' },
        { value: 'Sansar', label: 'सणसर' },
        { value: 'Sapkalwadi', label: 'सपकळवाडी' },
        { value: 'Sarafwadi', label: 'सराफवाडी' },
        { value: 'Sarati', label: 'सराटी' },
        { value: 'Sardewadi', label: 'सरडेवाडी' },
        { value: 'Shaha', label: 'शहा' },
        { value: 'Shelgaon', label: 'शेळगांव' },
        { value: 'Shetphal Haveli', label: 'शेटफळ हवेली' },
        { value: 'Shetphalgadhe', label: 'शेटफळ गढे' },
        { value: 'Shindewadi', label: 'शिंदेवाडी' },
        { value: 'Shirsodi', label: 'शिरसोडी' },
        { value: 'Sirsatwadi', label: 'शिरसटवाडी' },
        { value: "Sugaon (सुगांव)", label: "Sugaon (सुगांव)" },
        { value: "Surwad (सुरवड)", label: "Surwad (सुरवड)" },
        { value: "Takrarwadi (तक्रारवाडी)", label: "Takrarwadi (तक्रारवाडी)" },
        { value: "Tannu (टणू)", label: "Tannu (टणू)" },
        { value: "Tarangwadi (तरंगवाडी)", label: "Tarangwadi (तरंगवाडी)" },
        { value: "Taratgaon (तरटगांव)", label: "Taratgaon (तरटगांव)" },
        { value: "Tawashi (तावशी)", label: "Tawashi (तावशी)" },
        { value: 'Thoratwadi', label: 'थोरातवाडी' },
        { value: 'Thoratwadi (Rui)', label: 'थोरातवाडी (रूई)' },
        { value: "Udhat (उध्दट)", label: "Udhat (उध्दट)" },
        { value: "Vadapuri (वडापुरी)", label: "Vadapuri (वडापुरी)" },
        { value: "Vakilwasti (वकीलवस्ती)", label: "Vakilwasti (वकीलवस्ती)" },
        { value: "Vangali (वनगळी)", label: "Vangali (वनगळी)" },
        { value: "Varkute Kh. (वरकुटे खु.)", label: "Varkute Kh. (वरकुटे खु.)" },
        { value: "Vaysewadi (वायसेवाडी)", label: "Vaysewadi (वायसेवाडी)" },
        { value: "Vyahali (व्याहळी)", label: "Vyahali (व्याहळी)" },
        { value: "Walchandnagar (वालचंदनगर)", label: "Walchandnagar (वालचंदनगर)" },
        { value: "Warkute Bk. (वरकुटे बु.)", label: "Warkute Bk. (वरकुटे बु.)" },
        { value: "Zagadewadi (झगडेवाडी)", label: "Zagadewadi (झगडेवाडी)" },
      ]

      const PuneKhedOptions = [
        { value: 'Adgaon', label: 'आडगाव' },
        { value: 'Adhe', label: 'आढे' },
        { value: 'Ahire', label: 'आहिरे' },
        { value: 'Akharwadi', label: 'आखरवाडी' },
        { value: 'Akhatuli', label: 'अखतुली' },
        { value: 'Alandi', label: 'आळंदी' },
        { value: 'Ambethan', label: 'आंबेठाण' },
        { value: 'Ambhu', label: 'अंभु' },
        { value: 'Amboli', label: 'आंबोली' },
        { value: 'Anavale', label: 'अनावळे' },
        { value: 'Arudewadi', label: 'आरुडेवाडी' },
        { value: 'Askhed Bk.', label: 'आसखेड बु.' },
        { value: 'Askhed Kh.', label: 'आसखेड खु.' },
        { value: 'Avadar', label: 'आवदर' },
        { value: 'Avandhe', label: 'आवंढे' },
        { value: 'Awhat', label: 'आव्हाट' },
        { value: 'Bahirwadi', label: 'बहीरवाडी' },
        { value: 'Bahul', label: 'बहुळ' },
        { value: 'Bhalavadi', label: 'भलवडी' },
        { value: 'Bhamboli', label: 'भांबोली' },
        { value: 'Bhimashankarwadi', label: 'भिमाशंकरवाडी' },
        { value: 'Bhivegaon', label: 'भिवेगाव' },
        { value: 'Bhomale', label: 'भोमाळे' },
        { value: 'Bhorgiri', label: 'भोरगिरी' },
        { value: 'Bhose', label: 'भोसे' },
        { value: 'Biradvadi', label: 'बिरदवडी' },
        { value: 'Bursewadi', label: 'बुरसेवाडी' },
        { value: 'Butewadi', label: 'बुट्टेवाडी' },
        { value: 'Chakan', label: 'चाकण' },
        { value: 'Chandoli', label: 'चांडोली' },
        { value: 'Chandus', label: 'चांदुस' },
        { value: 'Charholi Kh.', label: 'चऱ्होली खु.' },
        { value: 'Chas', label: 'चास' },
        { value: 'Chaudharwadi', label: 'चौधरवाडी' },
        { value: 'Chichbaiwadi', label: 'चिंचबाईवाडी' },
        { value: 'Chikhalgaon', label: 'चिखलगांव' },
        { value: 'Chimbali', label: 'चिंबळी' },
        { value: 'Chinchoshi', label: 'चिंचोशी' },
        { value: 'Darakwadi', label: 'दरकवाडी' },
        { value: 'Davadi', label: 'दावडी' },
        { value: 'Dehane', label: 'डेहणे' },
        { value: 'Deshamukhwadi', label: 'देशमुखवाडी' },
        { value: 'Devoshi', label: 'देवोशी' },
        { value: 'Dhamane', label: 'धामणे' },
        { value: 'Dhamangaon Bk.', label: 'धामणगाव बु.' },
        { value: 'Dhamangaon Kh.', label: 'धामणगाव खु.' },
        { value: 'Dhanore', label: 'धानोरे' },
        { value: 'Dhorewadi', label: 'ढोरेवाडी' },
        { value: 'Dhuoli', label: 'धुवोली' },
        { value: 'Donde', label: 'दोंदे' },
        { value: 'Ekalahare', label: 'एकलहरे' },
        { value: 'Gadad', label: 'गडद' },
        { value: 'Gadakwadi', label: 'गाडकवाडी' },
        { value: 'Gargotwadi', label: 'गारगोटवाडी' },
        { value: 'Ghotavadi', label: 'घोटवडी' },
        { value: 'Golegaon', label: 'गोलेगाव' },
        { value: 'Gonavadi', label: 'गोनवडी' },
        { value: 'Goregaon', label: 'गोरेगांव' },
        { value: 'Gosasi', label: 'गोसासी' },
        { value: 'Gulani', label: 'गुळाणी' },
        { value: 'Gundalwadi', label: 'गुंडाळवाडी' },
        { value: 'Hedruj', label: 'हेद्रुज' },
        { value: 'Holewadi', label: 'होलेवाडी' },
        { value: 'Jaidwadi', label: 'जैदवाडी' },
        { value: 'Jarewadi', label: 'जरेवाडी' },
        { value: 'Jaulke Bk.', label: 'जऊळके बु.' },
        { value: 'Jaulke Kh.', label: 'जऊळके खु.' },
        { value: 'Kadachiwadi', label: 'कडाची वाडी' },
        { value: 'Kadadhe', label: 'कडधे' },
        { value: 'Kadus', label: 'कडूस' },
        { value: 'Kahu', label: 'कहु' },
        { value: 'Kalechiwadi', label: 'काळेचीवाडी' },
        { value: 'Kalmodi', label: 'कळमोडी' },
        { value: 'Kalus', label: 'काळूस' },
        { value: 'Kaman', label: 'कमान' },
        { value: 'Kanhersar', label: 'कनेरसर' },
        { value: 'Kanhewadi Bk.', label: 'कान्हेवाडी बु.' },
        { value: 'Kanhewadi Kh.', label: 'कान्हेवाडी खु.' },
        { value: 'Kanhewadi Tarf Chakan', label: 'कान्हेवाडी तर्फे चाकण' },
        { value: 'Karanj Vihire', label: 'करंज विहिरे' },
        { value: 'Karkudi', label: 'कारकुडी' },
        { value: 'Kasari', label: 'कासारी' },
        { value: 'Kelgaon', label: 'केळगाव' },
        { value: 'Khalchi Bhamburwadi', label: 'खालची भांबुरवाडी' },
        { value: 'Khalumbre', label: 'खालुंब्रे' },
        { value: 'Kharabwadi', label: 'खराबवाडी' },
        { value: 'Kharawali', label: 'खरवली' },
        { value: 'Kharoshi', label: 'खरोशी' },
        { value: 'Kharpud', label: 'खरपुड' },
        { value: 'Kharpudi Bk.', label: 'खरपुडी बु.' },
        { value: 'Kharpudi Kh.', label: 'खरपुडी खु.' },
        { value: 'Kiwale', label: 'किवळे' },
        { value: 'Kohinde Bk.', label: 'कोहिंडे बु.' },
        { value: 'Kohinde Kh.', label: 'कोहिंडे खु.' },
        { value: 'Kohinkarwadi', label: 'कोहीणकरवाडी' },
        { value: 'Koliye', label: 'कोळीये' },
        { value: 'Koregaon Bk.', label: 'कोरेगांव बु.' },
        { value: 'Koregaon Kh.', label: 'कोरेगाव खु.' },
        { value: 'Koyali Tarf Chakan', label: 'कोयाळी तर्फे चाकण' },
        { value: 'Koyali Tarf Wada', label: 'कोयाळी तर्फे वाडा' },
        { value: 'Koye', label: 'कोये' },
        { value: 'Kude Bk.', label: 'कुडे बु.' },
        { value: 'Kude Kh.', label: 'कुडे खु.' },
        { value: 'Kurkundi', label: 'कुरकुंडी' },
        { value: 'Kuruli', label: 'कुरुळी' },
        { value: 'Mahalunge', label: 'महाळुंगे' },
        { value: 'Majgaon', label: 'माजगांव' },
        { value: 'Mandoshi', label: 'मंदोशी' },
        { value: "Manjarewadi (मांजरेवाडी)", label: "Manjarewadi (मांजरेवाडी)" },
        { value: "Markal (मरकळ)", label: "Markal (मरकळ)" },
        { value: "Medankarwadi (मेदनकरवाडी)", label: "Medankarwadi (मेदनकरवाडी)" },
        { value: "Mirjewadi (मिरजेवाडी)", label: "Mirjewadi (मिरजेवाडी)" },
        { value: "Mohakal (मोहकल)", label: "Mohakal (मोहकल)" },
        { value: "Moi (मोई)", label: "Moi (मोई)" },
        { value: "Moroshi (मोरोशी)", label: "Moroshi (मोरोशी)" },
        { value: "Nanekarwadi (नाणेकरवाडी)", label: "Nanekarwadi (नाणेकरवाडी)" },
        { value: "Nayphad (नायफड)", label: "Nayphad (नायफड)" },
        { value: "Nighoje (निघोजे)", label: "Nighoje (निघोजे)" },
        { value: "Nimgaon (निमगाव)", label: "Nimgaon (निमगाव)" },
        { value: "Pabhe (पाभे)", label: "Pabhe (पाभे)" },
        { value: "Pacharnewadi (पाचारणेवाडी)", label: "Pacharnewadi (पाचारणेवाडी)" },
        { value: "Padali (पाडळी)", label: "Padali (पाडळी)" },
        { value: "Pait (पाईट)", label: "Pait (पाईट)" },
        { value: "Palu (पाळु)", label: "Palu (पाळु)" },
        { value: "Pangari (पांगरी)", label: "Pangari (पांगरी)" },
        { value: "Papalwadi (पापळवाडी)", label: "Papalwadi (पापळवाडी)" },
        { value: "Parale (पराळे)", label: "Parale (पराळे)" },
        { value: "Parsul (परसूल)", label: "Parsul (परसूल)" },
        { value: "Pimpalgaon Tarf Chakan (पिंपळगाव तफे चाकण)", label: "Pimpalgaon Tarf Chakan (पिंपळगाव तफे चाकण)" },
        { value: "Pimpalgaon Tarf Khed (पिंपळगांव तर्फे खेड)", label: "Pimpalgaon Tarf Khed (पिंपळगांव तर्फे खेड)" },
        { value: "Pimpri Bk. (पिंपरी बु.)", label: "Pimpri Bk. (पिंपरी बु.)" },
        { value: "Pimpri Kh. (पिंपरी खु.)", label: "Pimpri Kh. (पिंपरी खु.)" },
        { value: "Pur (पुर)", label: "Pur (पुर)" },
        { value: "Rajgurunagar (राजगुरुनगर)", label: "Rajgurunagar (राजगुरुनगर)" },
        { value: "Rakshewadi (राक्षेवाडी)", label: "Rakshewadi (राक्षेवाडी)" },
        { value: "Rase (रासे)", label: "Rase (रासे)" },
        { value: "Raundhalwadi (रौंधळवाडी)", label: "Raundhalwadi (रौंधळवाडी)" },
        { value: "Retavadi (रेटवडी)", label: "Retavadi (रेटवडी)" },
        { value: "Rohakal (रोहकल)", label: "Rohakal (रोहकल)" },
        { value: "Sabalewadi (साबळेवाडी)", label: "Sabalewadi (साबळेवाडी)" },
        { value: "Saburdi (साबुर्डी)", label: "Saburdi (साबुर्डी)" },
        { value: "Sakurdi (साकुर्डी)", label: "Sakurdi (साकुर्डी)" },
        { value: 'Sakurdi', label: 'साकुर्डी' },
        { value: 'Sandbhorwadi', label: 'सांडभोरवाडी' },
        { value: 'Sangurdi', label: 'सांगुर्डी' },
        { value: 'Santosh Nagar', label: 'संतोष नगर' },
        { value: 'Satkarsthal', label: 'सातकरस्थळ' },
        { value: 'Savardari', label: 'सावरदरी' },
        { value: 'Sayagaon', label: 'सायगाव' },
        { value: 'Shelgaon', label: 'शेलगाव' },
        { value: 'Shelu', label: 'शेलु' },
        { value: 'Shendurli', label: 'शेंदुर्ली' },
        { value: 'Shinde', label: 'शिंदे' },
        { value: 'Shirgaon', label: 'शिरगाव' },
        { value: 'Shiroli', label: 'शिरोली' },
        { value: 'Shive', label: 'शिवे' },
        { value: 'Siddhegavhan', label: 'सिद्धेगव्हाण' },
        { value: 'Solu', label: 'सोळु' },
        { value: 'Supe', label: 'सुपे' },
        { value: 'Surkundi', label: 'सुरकुंडी' },
        { value: 'Takalkarwadi', label: 'टाकळकरवाडी' },
        { value: 'Talavade', label: 'तळवडे' },
        { value: 'Tekavadi', label: 'टेकवडी' },
        { value: 'Tifanwwadi', label: 'तिफणवाडी' },
        { value: 'Tokavade', label: 'टोकावडे' },
        { value: 'Torne Bk', label: 'तोरणे बु.' },
        { value: 'Torne Kh', label: 'तोरणे खु.' },
        { value: 'Tukaiwadi', label: 'तुकाईवाडी' },
        { value: 'Vadgaon Ghenand', label: 'वडगाव घेनंद' },
        { value: 'Vadgaon Tarf Khed', label: 'वडगांव तर्फे खेड' },
        { value: 'Varale', label: 'वराळे' },
        { value: 'Varchi Bhamburwadi', label: 'वरची भांबुरवाडी' },
        { value: 'Varude', label: 'वरुडे' },
        { value: 'Velhavale', label: 'वेल्हावळे' },
        { value: 'Vetale', label: 'वेताळे' },
        { value: 'Virham', label: 'विऱ्हाम' },
        { value: 'Wada', label: 'वाडा' },
        { value: 'Wafegaon', label: 'वाफगांव' },
        { value: 'Waghu', label: 'वाघु' },
        { value: 'Wahagaon', label: 'वहागाव' },
        { value: 'Wajavane', label: 'वाजवणे' },
        { value: 'Wakalwadi', label: 'वाकळवाडी' },
        { value: 'Waki Bk', label: 'वाकी बु.' },
        { value: 'Waki Kh.', label: 'वाकी खु.' },
        { value: 'Waki Tarf Wada', label: 'वाकी तर्फे वाडा' },
        { value: 'Walad', label: 'वाळद' },
        { value: 'Wandre', label: 'वांद्रे' },
        { value: 'Wanjale', label: 'वांजळे' },
        { value: 'Washere', label: 'वाशेरे' },
        { value: 'Wasuli', label: 'वासुली' },
        { value: 'Yelwadi', label: 'येलवाडी' },
        { value: 'Yenave Bk.', label: 'येणवे बु.' },
        { value: 'Yenave Kh.', label: 'येणवे खु.' },
      ];

      const SambhajiNagarOptions = [
        { value: 'Amkheda', label: 'आमखेडा' },
        { value: 'Anad', label: 'अनाड' },
        { value: 'Anjola', label: 'अंजोळा' },
        { value: 'Bahulkheda', label: 'बहुलखेडा' },
        { value: 'Banoti', label: 'बनोटी' },
        { value: 'Banoti Tanda', label: 'बनोटी तांडा' },
        { value: 'Chondeshwar', label: 'चौडेंश्वर' },
        { value: 'Dabha', label: 'डाभा' },
        { value: 'Dastapur', label: 'दस्तापूर' },
        { value: 'Davhari', label: 'देव्हारी' },
        { value: 'Dhanwat', label: 'धनवट' },
        { value: 'Dhingapur', label: 'धिंगापुर' },
        { value: 'Fardapur', label: 'फर्दापुर' },
        { value: 'Galwada (B)', label: 'गलवाडा (ब)' },
        { value: 'Galwada (Soegaon)', label: 'गलवाडा (सोयगाव)' },
        { value: 'Ghanegaon', label: 'घाणेगाव' },
        { value: 'Ghanegaon Tanda', label: 'घाणेगाव तांडा' },
        { value: 'Ghorkund', label: 'घोरखुंड' },
        { value: 'Ghosala', label: 'घोसला' },
        { value: 'Gondegaon', label: 'गोदेंगाव' },
        { value: 'Hanumantkheda', label: 'हनुमंतखेडा' },
        { value: 'Hingana', label: 'हिंगणा' },
        { value: 'Hiwari', label: 'हिवरी' },
        { value: 'Jamthi', label: 'जामठी' },
        { value: 'Jangla Tanda', label: 'जंगलातांडा' },
        { value: 'Jangli Kotha', label: 'जंगली कोठा' },
        { value: 'Jarandi', label: 'जरंडी' },
        { value: 'Jawala', label: 'जवळा' },
        { value: 'Kaldari', label: 'काळदरी' },
        { value: 'Kankrala', label: 'कंक्राळा' },
        { value: 'Kawali', label: 'कौली' },
        { value: 'Kinhi', label: 'किन्ही' },
        { value: 'Lenapur', label: 'लेणापुर' },
        { value: 'Mahalbda', label: 'महालब्दा' },
        { value: 'Malegaon', label: 'माळेगाव' },
        { value: 'Malkheda', label: 'मालखेडा' },
        { value: 'Mhashikotha', label: 'म्हशीकोठा' },
        { value: 'Mohalai', label: 'मोहळाई' },
        { value: 'Molkheda', label: 'मोलखेडा' },
        { value: 'Mukhed', label: 'मुंखेड' },
        { value: 'Murti', label: 'मुर्ती' },
        { value: 'Nanda', label: 'नंदा' },
        { value: 'Nandatanda', label: 'नांदातांडा' },
        { value: 'Nandgaon', label: 'नांदगाव' },
        { value: 'Nandgaon Tanda', label: 'नांदगाव तांडा' },
        { value: 'Nayagaon', label: 'नायगांव' },
        { value: 'Nimbayati', label: 'निंबायती' },
        { value: 'Nimbhora', label: 'निंभोरा' },
        { value: 'Nimkheda', label: 'निमखेडा' },
        { value: 'Nimkhedi', label: 'निमखेडी' },
        { value: 'Palashi', label: 'पळाशी' },
        { value: 'Palaskheda', label: 'पळासखेडा' },
        { value: 'Palaskheda (Sa.)', label: 'पळासखेडा (सा.)' },
        { value: 'Pimpalwadi', label: 'पिंपळवाडी' },
        { value: 'Pimpla', label: 'पिंपळा' },
        { value: 'Pimpri', label: 'पिंप्री' },
        { value: 'Pimpri Antur', label: 'पिंप्री अंतुर' },
        { value: 'Pohari Bk', label: 'पोहरी बु.' },
        { value: 'Pohari Kh.', label: 'पोहरी खु.' },
        { value: 'Raksa', label: 'राक्सा' },
        { value: 'Rampura', label: 'रामपुरा' },
        { value: 'Raveri', label: 'रावेरी' },
        { value: 'Rawala', label: 'रवळा' },
        { value: 'Sawaladbara', label: 'सावळदबारा' },
        { value: 'Sawarkheda', label: 'सावरखेडा' },
        { value: 'Shindol', label: 'शिंदोळ' },
        { value: 'Soegaon', label: 'सोयगाव' },
        { value: 'Sonaswadi', label: 'सोनसवाडी' },
        { value: 'Thana', label: 'ठाणा' },
        { value: 'Tidka', label: 'तिडका' },
        { value: 'Tikhi', label: 'तिखी' },
        { value: 'Titawi', label: 'टिटवी' },
        { value: 'Titur', label: 'तितुर' },
        { value: 'Umarvihire', label: 'उमरविहीरे' },
        { value: 'Uppalkheda Antur', label: 'उप्पलखेडा अंन्तुर' },
        { value: 'Wadgaon (Tigji)', label: 'वडगांव (तिग्जी)' },
        { value: 'Wadi Sutonda', label: 'वाडी सुतांडा' },
        { value: 'Wakad', label: 'वाकद' },
        { value: 'Wakadi', label: 'वाकडी' },
        { value: 'Wangaon', label: 'वनगांव' },
        { value: 'Warkhedi Bk.', label: 'वरखेडी बु.' },
        { value: 'Warkhedi Kh.', label: 'वरखेडी खु.' },
        { value: 'Warthan', label: 'वरठाण' },
        { value: 'Wetalwadi', label: 'वेतळावाडी' },
      ]
      



  console.log(values);
  // const [cropImgsrc, setCropImgsrc] = useState(null);
  // const [imageRef, setImageRef] = useState();
  // const [crop, setCrop] = useState(
  //   // default crop config
  //   {
  //     unit: "%",
  //     width: 40,
  //     aspect: 9 / 11,
  //   }
  // );
  // async function cropImage(crop) {
  //   let random = Math.random().toString(36).substr(2, 5);
  //   if (imageRef && crop.width && crop.height) {
  //     // const croppedImage = await GetCroppedImg(
  //     //   imageRef,
  //     //   crop,
  //     //   "croppedImage" + random + ".jpeg" // destination filename
  //     // );

  //     // calling the props function to expose
  //     setValues({
  //       ...values,
  //       // croppedImage: croppedImage,
  //     });
  //     // setCropImgsrc(croppedImage ? URL.createObjectURL(croppedImage) : null);
  //   }
  // }
  // const handleProfilePicUpload = (e) => {
  //   setValues({
  //     ...values,
  //     userImages: e.target.files,
  //     userImage1: e.target.files[0] ? e.target.files[0] : null,
  //     userImage1src: e.target.files[0]
  //       ? URL.createObjectURL(e.target.files[0])
  //       : null,
  //     dlgOpen: true,
  //   });
  // };
  return (
    <Box sx={{ position: "relative", minHeight: "400px" }}>
      {/* <Box>
        {values.userImage1src !== null && (
          <Dialog onClose={() => {}} disableEscapeKeyDown open={values.dlgOpen}>
            <ReactCrop
              src={values.userImage1src}
              crop={crop}
              onImageLoaded={(imageRef) => setImageRef(imageRef)}
              onComplete={(cropConfig) => cropImage(cropConfig)}
              onChange={(c) => setCrop(c)}
            />
            <DialogActions
              onClick={() => setValues({ ...values, dlgOpen: false })}
            >
              I'm Done
            </DialogActions>
          </Dialog>
        )}
        <Card
          sx={{
            maxWidth: "380px",
            textAlign: "center",
            boxShadow: "#e5e5e5 0px 0px 8px 8px;",
          }}
        >
          <CardContent>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
              type="file"
              onChange={handleProfilePicUpload}
            />
            <label
              htmlFor="contained-button-file"
              style={{ display: "block", marginTop: "5px" }}
            >
              {cropImgsrc ? (
                <img
                  src={cropImgsrc}
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "90px",
                  }}
                  alt=""
                />
              ) : (
                <AccountCircle sx={{ width: "170px", height: "170px" }} />
              )}
            </label>
            <TextField
              variant="outlined"
              label="Tree ID"
              name="saplingid"
              value={values.saplingId}
              required
              onChange={(e) => {
                setValues({
                  ...values,
                  saplingId: e.target.value,
                });
              }}
            />
          </CardContent>
        </Card>
      </Box> */}

      {/* <TextField
          variant="outlined"
          name="district"
          label="District"          
          required
          onChange={(e) => setValues({ ...values, district: e.target.value })}
        />
        <TextField
          variant="outlined"
          name="taluka"
          label="Taluka"          
          required
          onChange={(e) => setValues({ ...values, taluka: e.target.value })}
        />
        <TextField
          variant="outlined"
          name="village"
          label="Village"          
          required
          onChange={(e) => setValues({ ...values, village: e.target.value })}
        /> */}

                       <Autocomplete
                        options={DistrictOptions}
                        getOptionLabel={(option)=>option.label}
                        // value={district}
                        onChange={(e) => setValues({ ...values, district: e.target.value })}
                        renderInput={(params)=>( 
                        <TextField
                           {...params}
                            
                            margin="dense"
                            name="district"
                            label="District"
                            type="text"
                            fullWidth
                        />)}  
                   />
                   {/* <TextField
                        select
                        margin="dense"
                        name="taluka"
                        label="Taluka"
                        type="text"
                        fullWidth
                        value={taluka}
                        onChange={(e)=>{setTaluka(e.target.value)}}
                        disabled={districtFlag === ''}
                   />    */}
                   {  districtFlag === '' && 
                   
                   (<TextField
                        select
                        margin="dense"
                        name="taluka"
                        label="Taluka"
                        type="text"
                        fullWidth
                        // value={taluka}
                        onChange={(e) => setValues({ ...values, taluka: e.target.value })}
                        // disabled={districtFlag === ''}
                   /> )} 
                   
                   {districtFlag === 'Budhana' && 
                   
                   (
                      <Autocomplete
                        options={BudhanaOptions}
                        getOptionLabel={(option)=>option.label}
                        // value={taluka}
                        onChange={(e) => setValues({ ...values, taluka: e.target.value })}
                        renderInput={(params)=>( 
                        <TextField
                          {...params}
                            
                            margin="dense"
                            name="taluka"
                            label="Taluka"
                            type="text"
                            fullWidth
                        />)}  
                     />)
               
                   }  {districtFlag === 'Pune' && 
                             (
                                <Autocomplete
                                options={PuneOptions }
                                getOptionLabel={(option)=>option.label}
                                // value={taluka}
                                onChange={(e) => setValues({ ...values, taluka: e.target.value })}
                                renderInput={(params)=>( 
                                <TextField
                                  {...params}
                                    
                                    margin="dense"
                                    name="taluka"
                                    label="Taluka"
                                    type="text"
                                    fullWidth
                                />)}  
                          />
                              )}  {districtFlag === 'Sambhajinagar' && (
                                <Autocomplete
                                options={SambhajinagarOptions }
                                getOptionLabel={(option)=>option.label}
                                // value={taluka}
                                onChange={(e) => setValues({ ...values, taluka: e.target.value })}
                                renderInput={(params)=>( 
                                <TextField
                                   {...params}
                                    
                                    margin="dense"
                                    name="taluka"
                                    label="Taluka"
                                    type="text"
                                    fullWidth
                                />)}  
                           />
                               )}  {districtFlag === 'Jalgaon' && (
                                <Autocomplete
                                options={JalgaonOptions}
                                getOptionLabel={(option)=>option.label}
                                // value={taluka}
                                onChange={(e) => setValues({ ...values, taluka: e.target.value })}
                                renderInput={(params)=>( 
                                <TextField
                                   {...params}
                                    
                                    margin="dense"
                                    name="taluka"
                                    label="Taluka"
                                    type="text"
                                    fullWidth
                                />)}  
                           />
                               )}
                               
                    
           

                   { talukaFlag === '' && ( <TextField
                        select
                        margin="dense"
                        name="village"
                        label="Village"
                        type="text"
                        fullWidth
                        // value={village}
                        onChange={(e) => setValues({ ...values, village: e.target.value })}
                        // disabled={talukaFlag === ''}
                    ></TextField>)
                   }
                    {districtFlag === 'Budhana' && talukaFlag === 'Budhana' && 
                       
                         (<Autocomplete
                                options={ BudhanaDTOptions}
                                getOptionLabel={(option)=>option.label}
                                // value={village}
                                onChange={(e) => setValues({ ...values, village: e.target.value })}
                                renderInput={(params)=>( 
                                <TextField
                                   {...params}
                                    
                                    margin="dense"
                                    name="village"
                                    label="Village"
                                    type="text"
                                    fullWidth
                                />)}  
                           />)}
                    
                    {districtFlag === 'Budhana' && talukaFlag === 'Khamgaon (खामगाव)' && 
                       
                         (<Autocomplete
                                options={ BudhanaKhamgaonOptions}
                                getOptionLabel={(option)=>option.label}
                                // value={village}
                                onChange={(e) => setValues({ ...values, village: e.target.value })}
                                renderInput={(params)=>( 
                                <TextField
                                   {...params}
                                    
                                    margin="dense"
                                    name="village"
                                    label="Village"
                                    type="text"
                                    fullWidth
                                />)}  
                           />)}

                {districtFlag === 'Budhana' && talukaFlag === 'Malkapur' && 
                       
                       (<Autocomplete
                              options={ BudhanaMalkapurOptions}
                              getOptionLabel={(option)=>option.label}
                              // value={village}
                              onChange={(e) => setValues({ ...values, village: e.target.value })}
                              renderInput={(params)=>( 
                              <TextField
                                 {...params}
                                  
                                  margin="dense"
                                  name="village"
                                  label="Village"
                                  type="text"
                                  fullWidth
                              />)}  
                         />)}
                        
                  
                   {districtFlag === 'Budhana' && talukaFlag === 'Motala (मोताळा)' && 
                       
                       (<Autocomplete
                              options={ BudhanaMotalaOptions}
                              getOptionLabel={(option)=>option.label}
                              // value={village}
                              onChange={(e) => setValues({ ...values, village: e.target.value })}
                              renderInput={(params)=>( 
                              <TextField
                                 {...params}
                                  
                                  margin="dense"
                                  name="village"
                                  label="Village"
                                  type="text"
                                  fullWidth
                              />)}  
                         />)}

                {districtFlag === 'Budhana' && talukaFlag === 'Nandura (नांदुरा)' && 
                       
                       (<Autocomplete
                              options={BudhanaNanduraOptions}
                              getOptionLabel={(option)=>option.label}
                              // value={village}
                              onChange={(e) => setValues({ ...values, village: e.target.value })}
                              renderInput={(params)=>( 
                              <TextField
                                 {...params}
                                  
                                  margin="dense"
                                  name="village"
                                  label="Village"
                                  type="text"
                                  fullWidth
                              />)}  
                         />)}
                         
                       {  districtFlag === 'Jalgaon' && talukaFlag === 'Jamner' && 
                         (
                          <Autocomplete
                            options={JalgaonJamnerOptions}
                            getOptionLabel={(option)=>option.label}
                            // value={village}
                            onChange={(e) => setValues({ ...values, village: e.target.value })}
                            renderInput={(params)=>( 
                            <TextField
                              {...params}
                                
                                margin="dense"
                                name="village"
                                label="Village"
                                type="text"
                                fullWidth
                            />)}  
                     />
                         )}

              {  districtFlag === 'Pune' && talukaFlag === 'Ambegaon (आंबेगाव)' && 
                         (
                          <Autocomplete
                            options={PuneAmbegaonOptions}
                            getOptionLabel={(option)=>option.label}
                            // value={village}
                            onChange={(e) => setValues({ ...values, village: e.target.value })}
                            renderInput={(params)=>( 
                            <TextField
                              {...params}
                                
                                margin="dense"
                                name="village"
                                label="Village"
                                type="text"
                                fullWidth
                            />)}  
                     />
                         )}
                         {  districtFlag === 'Pune' && talukaFlag === 'Indapur (इंदापूर)' && 
                         (
                          <Autocomplete
                            options={PuneIndapurOptions}
                            getOptionLabel={(option)=>option.label}
                            // value={village}
                            onChange={(e) => setValues({ ...values, village: e.target.value })}
                            renderInput={(params)=>( 
                            <TextField
                              {...params}
                                
                                margin="dense"
                                name="village"
                                label="Village"
                                type="text"
                                fullWidth
                            />)}  
                     />
                         )}
                             {  districtFlag === 'Pune' && talukaFlag === 'Khed (खेड)' && 
                         (
                          <Autocomplete
                            options={PuneKhedOptions}
                            getOptionLabel={(option)=>option.label}
                            // value={village}
                            onChange={(e) => setValues({ ...values, village: e.target.value })}
                            renderInput={(params)=>( 
                            <TextField
                              {...params}
                                
                                margin="dense"
                                name="village"
                                label="Village"
                                type="text"
                                fullWidth
                            />)}  
                     />
                         )}
                          {  districtFlag === 'Sambhajinagar' && talukaFlag === 'Soegaon' && 
                         (
                          <Autocomplete
                            options={SambhajiNagarOptions}
                            getOptionLabel={(option)=>option.label}
                            // value={village}
                            onChange={(e) => setValues({ ...values, village: e.target.value })}
                            renderInput={(params)=>( 
                            <TextField
                              {...params}
                                
                                margin="dense"
                                name="village"
                                label="Village"
                                type="text"
                                fullWidth
                            />)}  
                     />
                         )}



      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Button
          color="inherit"
          disabled={values.activeStep === 0}
          onClick={() =>
            setValues({ ...values, activeStep: values.activeStep - 1 })
          }
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          // disabled={values.saplingId === ""}
          type="submit"
          size="large"
          variant="contained"
          color="primary"
          onClick={() =>
            setValues({ ...values, activeStep: values.activeStep + 1 })
          }
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
