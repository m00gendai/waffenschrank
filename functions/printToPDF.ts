import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import { AmmoType, CommonStyles, GunType } from '../interfaces';
import { checkBoxes, gunDataTemplate, gunRemarks } from '../lib/gunDataTemplate';
import { newTags, pdfTitleAmmo, pdfTitleArt5 } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { pdfFooter, pdfTitle } from '../lib/textTemplates';
import { dateLocales } from '../configs';
import { ammoDataTemplate, ammoRemarks } from '../lib/ammoDataTemplate';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { expo, db } from "../db/client"
import * as schema from "../db/schema"

const art5Keys = checkBoxes.map(checkBox => checkBox.name)

async function getGunImages(guns:GunType[]){
  const imageArray: null | string[][] = []
  
  for(const gun of guns){
    let imgs: null | string[] = null
    if(gun.images && gun.images.length !== 0){
        imgs = await Promise.all(gun.images.map(async image =>{
            return await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
        }))
        imageArray.push(imgs)
    } else {
      imageArray.push([])
    }
  }
  return imageArray
}

async function getAmmoImages(ammunition:AmmoType[]){
  const imageArray: null | string[][] = []
  
  for(const ammo of ammunition){
    let imgs: null | string[] = null
    if(ammo.images && ammo.images.length !== 0){
        imgs = await Promise.all(ammo.images.map(async image =>{
            return await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
        }))
        imageArray.push(imgs)
    } else {
      imageArray.push([])
    }
  }
  return imageArray
}

const getTranslation = (key: string, language: string): string => {
    const data = gunDataTemplate.find(item => item.name === key);
    const remarks = gunRemarks.name === key ? gunRemarks[language] : null
    const boxes = checkBoxes.find(item => item.name === key);
    const tags = newTags.name === key ? newTags[language] : null
    return data ? data[language] : remarks ? remarks : boxes ? boxes[language] : tags ? tags : key;
  };


  const getTranslationAmmo = (key: string, language: string): string => {
    const data = ammoDataTemplate.find(item => item.name === key);
    const remarks = ammoRemarks.name === key ? ammoRemarks[language] : null
    const boxes = checkBoxes.find(item => item.name === key);
    const tags = newTags.name === key ? newTags[language] : null
    return data ? data[language] : remarks ? remarks : boxes ? boxes[language] : tags ? tags : key;
  };

  function getShortCaliberNameFromArray(calibers:string[], displayNames:{name:string, displayName:string}[], shortCaliber: boolean){
    if(!shortCaliber){
      return calibers
    }
    const outputArray = calibers.map(item => {
        // Find an object where displayName matches the item
        const match = displayNames.find(obj => obj.name === item)
        // If a match is found, return the displayName, else return the original item
        return match ? match.displayName : item;
    });
    return outputArray
}

function getShortCaliberNameFromString(calibers:string, displayNames:{name:string, displayName:string}[], shortCaliber: boolean){
  if(!shortCaliber){
    return calibers
  }
  const match = displayNames.find(obj => obj.name === calibers)
  return match ? match.displayName : calibers;
}

  const commonStyles:CommonStyles={
    allPageMargin: "15mm",
    allPageMarginIOS: Math.ceil(15*2.83465),
    allTitleFontSize: "30px",
    allSubtitleFontSize: "12px",
    allTableFontSize: "15px",
    imageGap: "20px",
    tableVerticalMargin: "20px",
    tableRowVerticalPadding: "5px",
    tableCellPadding: "5px",
    footerWidth: "calc(100% - 30mm)",
    footerFontSize: "8px",
    footerTopBorder: "1px solid grey",
    footerPaddingTop: "5px",
    footerMarginTop: "5mm",
    tagPadding: "5px",
    tagFontSize: "10px",
    tagContainerGap: "10px"
  }
  

export async function printSingleGun(gun:GunType, language: string, shortCaliber: boolean, caliberDisplayNameList: {name:string, displayName:string}[]){

    let imgs: null | string[] = null
    if(gun.images && gun.images.length !== 0){
        imgs = await Promise.all(gun.images.map(async image =>{
            return await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
        }))
    }

    const date:Date = new Date()
    const dateOptions:Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "2-digit",
        minute: "2-digit"
      };
    const generatedDate:string = date.toLocaleDateString(dateLocales[language], dateOptions)
    const excludedKeys = ["db_id", "images", "createdAt", "lastModifiedAt", "id", "tags", "remarks", "lastCleanedAt", "lastShotAt", "cleanInterval"];
    
    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body>
      <div class="bodyContent">
        <h1>${gun.manufacturer ? gun.manufacturer : ""} ${gun.model}</h1>
        ${gun.images && gun.images.length !== 0 ? `<div class="imageContainer">${imgs.map(img => {return `<div class="imageDiv"><img class="image" src="data:image/jpeg;base64,${img}" /></div>`}).join("")}</div>`: ""}
        ${gun.tags && gun.tags.length !== 0 ? `<div class="tagContainer">${gun.tags.map(tag => {return `<div class="tag">${tag}</div>`}).join("")}</div>` : ""}
        ${gun.tags && gun.tags.length !== 0 ? `<hr />` : ""}
        ${Object.entries(gun).some(status => art5Keys.includes(status[0])) ? `<div class="tagContainer">${Object.entries(gun).map(status => {return art5Keys.includes(status[0]) && gun[status[0]] ? `<div class="tag">${getTranslation(status[0], language)}</div>` : ""}).join("")}</div>` : ""}
        <table>
            <tbody>
                ${Object.entries(gun)
                  .filter(entry => ![...excludedKeys, ...art5Keys].includes(entry[0]) && entry[1] !== null && entry[1] !== "")
                  .map(entry =>{
                    return `<tr><td><strong>${getTranslation(entry[0], language)}</strong></td><td class=${entry[0] === "caliber" ? "whitespace" : ""}>${entry[0] === "caliber" ? getShortCaliberNameFromArray(entry[1], caliberDisplayNameList, shortCaliber).join("\n") : entry[1]}</td></tr>`
                }).join("")}
            </tbody>
        </table>
        ${gun.remarks && gun.remarks.length !== 0 ? `<div class="remarkContainer"><div class="remarkContainerTitle"><strong>${gunRemarks[language]}</strong></div><div class="remarkContainerContent">${gun.remarks}</div></div>`: ""}
      </div>
        
     </body>
     <div class="footer">${gun.manufacturer ? gun.manufacturer : ""} ${gun.model}: ${pdfFooter[language]}, ${generatedDate}</div>
      <style>
      @page {
        size: A4;
        margin: ${commonStyles.allPageMargin};
      }
      body{
        display: flex;
        justify-content: center;
        align-items: flex-start;
        align-content: flex-start;
        margin: 0;
        padding: 0;
        font-family: "Helvetica";
      }
      h1{
        position: relative;
        width: 100%;
        text-align: left;
        margin: 0;
        padding: 0;
        font-size: ${commonStyles.allTitleFontSize};
      }
      hr{
        width: 100%;
      }
      .bodyContent{
        width: 100%;
        padding: 0;
        box-sizing: border-box;
      }
      .imageContainer {
        position: relative;
            width: 100%;
            aspect-ratio: 30/10;
            display: flex;
            gap: ${commonStyles.imageGap};
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            margin: 10px 0;
            box-shadow: 0px 2px 5px -2px black;
            padding: 5px;
      }
      .imageDiv {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    .tagContainer{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start; 
        flex-wrap: wrap;
        gap: ${commonStyles.tagContainerGap};
    }
        .tag{
            position: relative;
            border: 1px solid black;
            padding: ${commonStyles.tagPadding};
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: ${commonStyles.tagFontSize};
        }
    table {
        position: relative;
        margin: ${commonStyles.tableVerticalMargin} 0;
        width: 100%;
        font-size: ${commonStyles.allTableFontSize};
        border-collapse: collapse;
    }
    table > tbody > tr {
        padding: ${commonStyles.tableRowVerticalPadding} 0;
    }
    table > tbody > tr:nth-child(even){
        background-color: #f5f5f5;
    }
    table > tbody > tr > td {
        padding: ${commonStyles.tableCellPadding};
        
    }
    .remarkContainer{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .remarkContainerTitle{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .remarkContainerContent{
        position: relative;
        width: 100%;
        white-space: pre-wrap;
    }
    .whitespace{
      white-space: pre-wrap;
    }
    .footer{
      position: fixed;
      bottom: 0;
      width: ${commonStyles.footerWidth};
      font-size: ${commonStyles.footerFontSize};
      border-top: ${commonStyles.footerTopBorder};
      padding-top: ${commonStyles.footerPaddingTop};
      margin-top: ${commonStyles.footerMarginTop};
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
  }
      </style>
    </html>
    `;

    if (Platform.OS === 'ios') {
      const file = await Print.printToFileAsync({
        html: html,
        height:842, 
        width:595, 
        margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS},
        base64: true
      });
      console.log(file.uri);
      await shareAsync(file.uri);
    } else if(Platform.OS === "android"){
      console.log("android")
      const { uri } = await Print.printToFileAsync({html, height:595, width:842, margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS}});
      const cUri = await FileSystem.getContentUriAsync(uri)
      console.log('File has been saved to:', uri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1,
          type: 'application/pdf'
      });
    }   
      
}

export async function printSingleAmmo(ammo:AmmoType, language: string, shortCaliber: boolean, caliberDisplayNameList: {name:string, displayName:string}[]){

  let imgs: null | string[] = null
  if(ammo.images && ammo.images.length !== 0){
      imgs = await Promise.all(ammo.images.map(async image =>{
          return await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
      }))
  }

  const date:Date = new Date()
  const dateOptions:Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: "2-digit",
      minute: "2-digit"
    };
  const generatedDate:string = date.toLocaleDateString(dateLocales[language], dateOptions)
  const excludedKeys = ["db_id", "images", "createdAt", "lastModifiedAt", "lastTopUpAt", "id", "tags", "remarks", "previousStock", "currentStock", "criticalStock"];
  const art5Keys = checkBoxes.map(checkBox => checkBox.name)

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body>
    <div class="bodyContent">
      <h1>${ammo.manufacturer ? ammo.manufacturer : ""} ${ammo.designation}</h1>
      ${ammo.images && ammo.images.length !== 0 ? `<div class="imageContainer">${imgs.map(img => {return `<div class="imageDiv"><img class="image" src="data:image/jpeg;base64,${img}" /></div>`}).join("")}</div>`: ""}
      ${ammo.tags && ammo.tags.length !== 0 ? `<div class="tagContainer">${ammo.tags.map(tag => {return `<div class="tag">${tag}</div>`}).join("")}</div>` : ""}
      ${ammo.tags && ammo.tags.length !== 0 ? `<hr />` : ""}
      <table>
          <tbody>
              ${Object.entries(ammo)
                .filter(entry => !excludedKeys.includes(entry[0]) && entry[1] !== null && entry[1] !== "")
                .map(entry =>{
                  return excludedKeys.includes(entry[0]) ? null :`<tr><td><strong>${getTranslationAmmo(entry[0], language)}</strong></td><td>${entry[0] === "caliber" ? getShortCaliberNameFromString(entry[1], caliberDisplayNameList, shortCaliber) : entry[1]}</td></tr>`
              }).join("")}
          </tbody>
      </table>
      ${ammo.remarks && ammo.remarks.length !== 0 ? `<div class="remarkContainer"><div class="remarkContainerTitle"><strong>${ammoRemarks[language]}</strong></div><div class="remarkContainerContent">${ammo.remarks}</div></div>`: ""}
    </div>
      
   </body>
   <div class="footer">${ammo.manufacturer ? ammo.manufacturer : ""} ${ammo.designation}: ${pdfFooter[language]}, ${generatedDate}</div>
   <style>
   @page {
     size: A4;
     margin: ${commonStyles.allPageMargin};
   }
   body{
     display: flex;
     justify-content: center;
     align-items: flex-start;
     align-content: flex-start;
     margin: 0;
     padding: 0;
     font-family: "Helvetica";
   }
   h1{
     position: relative;
     width: 100%;
     text-align: left;
     margin: 0;
     padding: 0;
     font-size: ${commonStyles.allTitleFontSize};
   }
   hr{
     width: 100%;
   }
   .bodyContent{
     width: 100%;
     padding: 0;
     box-sizing: border-box;
   }
   .imageContainer {
    position: relative;
        width: 100%;
        aspect-ratio: 30/10;
        display: flex;
        gap: ${commonStyles.imageGap};
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        margin: 10px 0;
        box-shadow: 0px 2px 5px -2px black;
        padding: 5px;
  }
  .imageDiv {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
 .tagContainer{
     position: relative;
     width: 100%;
     display: flex;
     justify-content: flex-start;
     align-items: flex-start; 
     flex-wrap: wrap;
     gap: ${commonStyles.tagContainerGap};
 }
     .tag{
         position: relative;
         border: 1px solid black;
         padding: ${commonStyles.tagPadding};
         display: flex;
         justify-content: center;
         align-items: center;
         font-size: ${commonStyles.tagFontSize};
     }
 table {
     position: relative;
     margin: ${commonStyles.tableVerticalMargin} 0;
     width: 100%;
     font-size: ${commonStyles.allTableFontSize};
     border-collapse: collapse;
 }
 table > tbody > tr {
     padding: ${commonStyles.tableRowVerticalPadding} 0;
 }
 table > tbody > tr:nth-child(even){
     background-color: #f5f5f5;
 }
 table > tbody > tr > td {
     padding: ${commonStyles.tableCellPadding};
     
 }
 .remarkContainer{
     position: relative;
     width: 100%;
     display: flex;
     justify-content: center;
     align-items: flex-start;
     flex-wrap: wrap;
 }
 .remarkContainerTitle{
     position: relative;
     width: 100%;
     display: flex;
     justify-content: flex-start;
     align-items: center;
 }
 .remarkContainerContent{
     position: relative;
     width: 100%;
     white-space: pre-wrap;
 }
 .footer{
   position: fixed;
   bottom: 0;
   width: ${commonStyles.footerWidth};
   font-size: ${commonStyles.footerFontSize};
   border-top: ${commonStyles.footerTopBorder};
   padding-top: ${commonStyles.footerPaddingTop};
   margin-top: ${commonStyles.footerMarginTop};
   display: flex;
   justify-content: center;
   align-items: center;
   align-content: center;
}
   </style>
  </html>
  `;

  if (Platform.OS === 'ios') {
    const file = await Print.printToFileAsync({
      html: html,
      height:842, 
      width:595, 
      margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS},
      base64: true
    });
    console.log(file.uri);
    await shareAsync(file.uri);
  } else if(Platform.OS === "android"){
    console.log("android")
    const { uri } = await Print.printToFileAsync({html, height:595, width:842, margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS}});
    const cUri = await FileSystem.getContentUriAsync(uri)
    console.log('File has been saved to:', uri);
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: 'application/pdf'
    });
  }   
    
}

export async function printAmmoGallery(ammunition:AmmoType[], language: string){

  const imageArray:null | string[][] = await getAmmoImages(ammunition)

  const date:Date = new Date()
  const dateOptions:Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: "2-digit",
      minute: "2-digit"
    };
  const generatedDate:string = date.toLocaleDateString(dateLocales[language], dateOptions)
  const excludedKeys = ["images", "createdAt", "lastModifiedAt", "lastTopUpAt", "id", "tags", "remarks", "previousStock", "currentStock", "criticalStock"];

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body>
    ${ammunition.map((ammo, index) =>{
return(
    `
    <div class="bodyContent">
      <h1>${ammo.manufacturer ? ammo.manufacturer : ""} ${ammo.designation}</h1>
      ${imageArray[index].length !== 0 ? `<div class="imageContainer">${imageArray[index].map(img => {return `<div class="image" style="background-image: url(data:image/jpeg;base64,${img});"></div>`}).join("")}</div>`: ""}
      ${ammo.tags && ammo.tags.length !== 0 ? `<div class="tagContainer">${ammo.tags.map(tag => {return `<div class="tag">${tag}</div>`}).join("")}</div>` : ""}
      ${ammo.tags && ammo.tags.length !== 0 ? `<hr />` : ""}
      <table>
          <tbody>
              ${Object.entries(ammo).map(entry =>{
                  
                  return excludedKeys.includes(entry[0]) ? null :`<tr><td><strong>${getTranslationAmmo(entry[0], language)}</strong></td><td>${entry[1]}</td></tr>`
              }).join("")}
          </tbody>
      </table>
      ${ammo.remarks && ammo.remarks.length !== 0 ? `<div class="remarkContainer"><div class="remarkContainerTitle"><strong>${ammoRemarks[language]}</strong></div><div class="remarkContainerContent">${ammo.remarks}</div></div>`: ""}
    </div>`
  )}).join("")}
   </body>
   <div class="footer">${pdfFooter[language]}, ${generatedDate}</div>
   <style>
   @page {
     size: A4;
     margin: ${commonStyles.allPageMargin};
   }
   body{
     display: flex;
     justify-content: center;
     align-items: flex-start;
     align-content: flex-start;
     flex-wrap: wrap;
     margin: 0;
     padding: 0;
   }
   h1{
     position: relative;
     width: 100%;
     text-align: left;
     margin: 0;
     padding: 0;
     font-size: ${commonStyles.allTitleFontSize};
   }
   hr{
     width: 100%;
   }
   .bodyContent{
     width: 100%;
     height: 100%;
     padding: 0;
     box-sizing: border-box;
   }
   .imageContainer{
     position: relative;
     width: 100%;
     aspect-ratio: 30/10;
     display: flex;
     gap: ${commonStyles.imageGap};
     justify-content: center;
     align-items: center;
     flex-wrap: nowrap;
     margin: 10px 0;
     box-shadow: 0px 2px 5px -2px black;
     padding: 5px;
   }
     .image{
         position: relative;
         width: 100%;
         height: 100%;
         
         background-size:contain;
         background-position: top;
         background-repeat: no-repeat;
     }
 .tagContainer{
     position: relative;
     width: 100%;
     display: flex;
     justify-content: flex-start;
     align-items: flex-start; 
     flex-wrap: wrap;
     gap: ${commonStyles.tagContainerGap};
 }
     .tag{
         position: relative;
         border: 1px solid black;
         padding: ${commonStyles.tagPadding};
         display: flex;
         justify-content: center;
         align-items: center;
         font-size: ${commonStyles.tagFontSize};
     }
 table {
     position: relative;
     margin: ${commonStyles.tableVerticalMargin} 0;
     width: 100%;
     font-size: ${commonStyles.allTableFontSize};
     border-collapse: collapse;
 }
 table > tbody > tr {
     padding: ${commonStyles.tableRowVerticalPadding} 0;
 }
 table > tbody > tr:nth-child(even){
     background-color: #f5f5f5;
 }
 table > tbody > tr > td {
     padding: ${commonStyles.tableCellPadding};
     
 }
 .remarkContainer{
     position: relative;
     width: 100%;
     display: flex;
     justify-content: center;
     align-items: flex-start;
     flex-wrap: wrap;
 }
 .remarkContainerTitle{
     position: relative;
     width: 100%;
     display: flex;
     justify-content: flex-start;
     align-items: center;
 }
 .remarkContainerContent{
     position: relative;
     width: 100%;
     white-space: pre-wrap;
 }
 .footer{
   position: fixed;
   bottom: 0;
   width: ${commonStyles.footerWidth};
   font-size: ${commonStyles.footerFontSize};
   border-top: ${commonStyles.footerTopBorder};
   padding-top: ${commonStyles.footerPaddingTop};
   margin-top: ${commonStyles.footerMarginTop};
   display: flex;
   justify-content: center;
   align-items: center;
   align-content: center;
}
   </style>
  </html>
  `;


      // On iOS/android prints the given html. On web prints the HTML from the current page.
      const { uri } = await Print.printToFileAsync({html, height:842, width:595});
      console.log('File has been saved to:', uri);
     
     // await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
     FileSystem.getContentUriAsync(uri).then(cUri => {
      /* if (Platform.OS === 'ios') {
        Sharing.shareAsync(cUri); */
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1,
          type: 'application/pdf'
       });
    });
    
}

export async function printGunCollection(language: string, shortCaliber: boolean, caliberDisplayNameList: {name:string, displayName:string}[]){
console.log("HELLO THIS IS GUN COLLECTION")
const guns = await db.select().from(schema.gunCollection)
  const date:Date = new Date()
  const dateOptions:Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: "2-digit",
      minute: "2-digit"
    };
  const generatedDate:string = date.toLocaleDateString(dateLocales[language], dateOptions)
  const excludedKeys = ["images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks", "manufacturingDate", "originCountry", "paidPrice", "shotCount", "mainColor", "lastCleanedAt", "cleanInterval", "lastShotAt", "marketValue", "boughtFrom"];
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body>
    <div class="bodyContent">
      <h1>${pdfTitle[language]}</h1>
        <table>
        <thead>
          <tr>
          ${gunDataTemplate.map(data=>{return excludedKeys.includes(data.name) ? null : `<th>${data[language]}</th>`}).join("")}
          </tr>
        </thead>
          <tbody>
              ${guns.map(gun =>{
                /*@ts-expect-error*/
                return `<tr>${gunDataTemplate.map(data=>{return data.name in gun && !excludedKeys.includes(data.name) ? `<td class=${data.name === "caliber" ? "whitespace" : ""}>${data.name === "caliber" ? getShortCaliberNameFromArray(gun[data.name], caliberDisplayNameList, shortCaliber).join(",\n") : gun[data.name] !== null ? gun[data.name] : ""}</td>` : !(data.name in gun) && !excludedKeys.includes(data.name) ? `<td></td>`: null}).join("")}</tr>`}).join("")}
          </tbody>
      </table>
    </div>
      
   </body>
   <div class="footer">${pdfFooter[language]}, ${generatedDate}</div>
   <style>
   @page {
     size: A4 landscape;
     margin:${commonStyles.allPageMargin};
   }
   body{
     display: flex;
     justify-content: center;
     align-items: flex-start;
     align-content: flex-start;
     margin: 0;
     padding: 0;
     font-family: "Helvetica";
   }
   h1{
     position: relative;
     width: 100%;
     text-align: left;
     margin: 0;
     padding: 0;
     font-size: ${commonStyles.allTitleFontSize};
   }
   .legend{
     width: 100%;
     text-align: left;
     font-size: ${commonStyles.allSubtitleFontSize};
   }
   .bodyContent{
     width: 100%;
     padding: 0;
     box-sizing: border-box;
   }
 table {
     position: relative;
     margin: ${commonStyles.tableVerticalMargin} 0;
     width: 100%;
     font-size: ${commonStyles.allTableFontSize};
     border-collapse: collapse;
 }

 tr {
   position: relative;
     padding: ${commonStyles.tableRowVerticalPadding} 0;
     width: 100%;
 }
 tr:nth-child(even){
     background-color: #f5f5f5;
 }
 td {
     padding: ${commonStyles.tableCellPadding};
     vertical-align: top;
 }
 th{
   text-align: left;
   padding: ${commonStyles.tableCellPadding};
 }
 th, td{
   border: 1px solid #ddd;
 }
 .hidden{
   color: transparent;
 }
 .whitespace{
   white-space: pre-wrap;
 }
 .footer{
     position: fixed;
     bottom: 0;
     width: ${commonStyles.footerWidth};
     font-size: ${commonStyles.footerFontSize};
     border-top: ${commonStyles.footerTopBorder};
     padding-top: ${commonStyles.footerPaddingTop};
     margin-top: ${commonStyles.footerMarginTop};
     display: flex;
     justify-content: center;
     align-items: center;
     align-content: center;
 }
   </style>
  </html>
  `;

  console.log("finished HTML")
  console.log("begin printing gun collection")
       
  if (Platform.OS === 'ios') {
    console.log("ios")
    const file = await Print.printToFileAsync({
      html: html,
      height:595, 
      width:842, 
      margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS},
      base64: true
    });
    console.log(file.uri);
    await shareAsync(file.uri);
  } else if(Platform.OS === "android"){
    console.log("android")
    const { uri } = await Print.printToFileAsync({html, height:595, width:842, margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS}});
    const cUri = await FileSystem.getContentUriAsync(uri)
    console.log('File has been saved to:', uri);
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: 'application/pdf'
    });
  }    
}

export async function printGunCollectionArt5(language: string, shortCaliber: boolean, caliberDisplayNameList: {name:string, displayName:string}[]){
console.log("HELLO THIS IS GUN COLLECTION ART 5")
const guns = await db.select().from(schema.gunCollection)
  const date:Date = new Date()
  const dateOptions:Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: "2-digit",
      minute: "2-digit"
    };
  const generatedDate:string = date.toLocaleDateString(dateLocales[language], dateOptions)
  const excludedKeys = ["images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks", "manufacturingDate", "originCountry", "paidPrice", "shotCount", "mainColor", "lastCleanedAt", "cleanInterval", "lastShotAt", "marketValue", "boughtFrom"];
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body>
    <div class="bodyContent">
      <h1>${pdfTitleArt5[language]}</h1>
      <p class="legend">${checkBoxes.map((box, index) => `${index+1}: ${box[language]}`).join(", ")}<p>
        <table>
        <thead>
          <tr>
          ${gunDataTemplate.map(data=>{return excludedKeys.includes(data.name) ? null : `<th>${data[language]}</th>`}).join("")}${checkBoxes.map((box, index) => `<th>${index+1}</th>`).join("")}
          </tr>
        </thead>
          <tbody>
              ${guns.map(gun =>{
                if(Object.entries(gun).some(stat => art5Keys.includes(stat[0]))){
                  /*@ts-expect-error*/
                  return `<tr>${gunDataTemplate.map(data=>{return data.name in gun && !excludedKeys.includes(data.name) ? `<td class=${data.name === "caliber" ? "whitespace" : ""}>${data.name === "caliber" ? getShortCaliberNameFromArray(gun[data.name], caliberDisplayNameList, shortCaliber).join(",\n") : gun[data.name] === null ? "" : gun[data.name]}</td>` : !(data.name in gun) && !excludedKeys.includes(data.name) ? `<td></td>`: null}).join("")}${checkBoxes.map(box => {return gun[box.name] === true ? `<td class="xcell">X</td>` : `<td class="hidden"> </td>` }).join("")}</tr>`
                }
              }).join("")
            }
          </tbody>
      </table>
    </div>
      
   </body>
   <div class="footer">${pdfFooter[language]}, ${generatedDate}</div>
   <style>
   @page {
     size: A4 landscape;
     margin:${commonStyles.allPageMargin};
   }
   body{
     display: flex;
     justify-content: center;
     align-items: flex-start;
     align-content: flex-start;
     margin: 0;
     padding: 0;
     font-family: "Helvetica";
   }
   h1{
     position: relative;
     width: 100%;
     text-align: left;
     margin: 0;
     padding: 0;
     font-size: ${commonStyles.allTitleFontSize};
   }
   .legend{
     width: 100%;
     text-align: left;
     font-size: ${commonStyles.allSubtitleFontSize};
   }
   .bodyContent{
     width: 100%;
     padding: 0;
     box-sizing: border-box;
   }
 table {
     position: relative;
     margin: ${commonStyles.tableVerticalMargin} 0;
     width: 100%;
     font-size: ${commonStyles.allTableFontSize};
     border-collapse: collapse;
 }

 tr {
   position: relative;
     padding: ${commonStyles.tableRowVerticalPadding} 0;
     width: 100%;
 }
 tr:nth-child(even){
     background-color: #f5f5f5;
 }
 td {
     padding: ${commonStyles.tableCellPadding};
     vertical-align: top;
 }
 th{
   text-align: left;
   padding: ${commonStyles.tableCellPadding};
 }
 th, td{
   border: 1px solid #ddd;
 }
 .xcell{
  align: center;
 }
 .hidden{
   color: transparent;
 }
 .whitespace{
   white-space: pre-wrap;
 }
 .footer{
     position: fixed;
     bottom: 0;
     width: ${commonStyles.footerWidth};
     font-size: ${commonStyles.footerFontSize};
     border-top: ${commonStyles.footerTopBorder};
     padding-top: ${commonStyles.footerPaddingTop};
     margin-top: ${commonStyles.footerMarginTop};
     display: flex;
     justify-content: center;
     align-items: center;
     align-content: center;
 }
   </style>
  </html>
  `;
  console.log("finished HTML")
  console.log("begin printing gun collection")
  if (Platform.OS === 'ios') {
    const file = await Print.printToFileAsync({
      html: html,
      height:595, 
      width:842, 
      margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS},
      base64: true
    });
    console.log(file.uri);
    await shareAsync(file.uri);
  } else if(Platform.OS === "android"){
    console.log("android")
    const { uri } = await Print.printToFileAsync({html, height:595, width:842, margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS}});
    const cUri = await FileSystem.getContentUriAsync(uri)
    console.log('File has been saved to:', uri);
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: 'application/pdf'
    });
  }   
}

export async function printGunGallery(guns:GunType[], language: string){

    const date:Date = new Date()
    const dateOptions:Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "2-digit",
        minute: "2-digit"
      };
    const generatedDate:string = date.toLocaleDateString(dateLocales[language], dateOptions)
    const excludedKeys = ["images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks", "lastCleanedAt", "lastShotAt"];
    const art5Keys = checkBoxes.map(checkBox => checkBox.name)

    const imageArray:null | string[][] = await getGunImages(guns)

    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body>
      ${guns.map((gun, index) =>{
        
        return(
         `<div class="bodyContent">
        <h1>${gun.manufacturer ? gun.manufacturer : ""} ${gun.model}</h1>
        ${imageArray[index].length !== 0 ? `<div class="imageContainer">${imageArray[index].map(img => {return `<div class="image" style="background-image: url(data:image/jpeg;base64,${img});"></div>`}).join("")}</div>`: ""}
        ${gun.tags && gun.tags.length !== 0 ? `<div class="tagContainer">${gun.tags.map(tag => {return `<div class="tag">${tag}</div>`}).join("")}</div>` : ""}
        ${gun.tags && gun.tags.length !== 0 ? `<hr />` : ""}
        ${gun.status && Object.entries(gun.status).length !== 0 ? `<div class="tagContainer">${Object.entries(gun.status).map(status => {return status[1] && art5Keys.includes(status[0]) ? `<div class="tag">${getTranslation(status[0], language)}</div>` : ""}).join("")}</div>` : ""}
        <table>
            <tbody>
                ${Object.entries(gun).map(entry =>{
                    
                    return excludedKeys.includes(entry[0]) ? null :`<tr><td><strong>${getTranslation(entry[0], language)}</strong></td><td>${entry[1]}</td></tr>`
                }).join("")}
            </tbody>
        </table>
        ${gun.remarks && gun.remarks.length !== 0 ? `<div class="remarkContainer"><div class="remarkContainerTitle"><strong>${gunRemarks[language]}</strong></div><div class="remarkContainerContent">${gun.remarks}</div></div>`: ""}
      
        </div>`
        )
              }).join("")}
      </body>
     <div class="footer">${pdfFooter[language]}, ${generatedDate}</div>
      <style>
      @page {
        size: A4;
        margin: ${commonStyles.allPageMargin};
      }
      body{
        display: flex;
        justify-content: center;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
      }
      h1{
        position: relative;
        width: 100%;
        text-align: left;
        margin: 0;
        padding: 0;
        font-size: ${commonStyles.allTitleFontSize};
      }
      hr{
        width: 100%;
      }
      .bodyContent{
        width: 100%;
        height: 100%;
        padding: 0;
        box-sizing: border-box;
      }
      .imageContainer{
        position: relative;
        width: 100%;
        aspect-ratio: 30/10;
        display: flex;
        gap: ${commonStyles.imageGap};
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        margin: 10px 0;
        box-shadow: 0px 2px 5px -2px black;
        padding: 5px;
      }
        .image{
            position: relative;
            width: 100%;
            height: 100%;
            
            background-size:contain;
            background-position: top;
            background-repeat: no-repeat;
        }
    .tagContainer{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start; 
        flex-wrap: wrap;
        gap: ${commonStyles.tagContainerGap};
    }
        .tag{
            position: relative;
            border: 1px solid black;
            padding: ${commonStyles.tagPadding};
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: ${commonStyles.tagFontSize};
        }
    table {
        position: relative;
        margin: ${commonStyles.tableVerticalMargin} 0;
        width: 100%;
        font-size: ${commonStyles.allTableFontSize};
        border-collapse: collapse;
    }
    table > tbody > tr {
        padding: ${commonStyles.tableRowVerticalPadding} 0;
    }
    table > tbody > tr:nth-child(even){
        background-color: #f5f5f5;
    }
    table > tbody > tr > td {
        padding: ${commonStyles.tableCellPadding};
        
    }
    .remarkContainer{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .remarkContainerTitle{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .remarkContainerContent{
        position: relative;
        width: 100%;
        white-space: pre-wrap;
    }
    .footer{
      position: fixed;
      bottom: 0;
      width: ${commonStyles.footerWidth};
      font-size: ${commonStyles.footerFontSize};
      border-top: ${commonStyles.footerTopBorder};
      padding-top: ${commonStyles.footerPaddingTop};
      margin-top: ${commonStyles.footerMarginTop};
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
  }
      </style>
    </html>
    `;


        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({html, height:842, width:595});
        console.log('File has been saved to:', uri);
       
       // await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
       FileSystem.getContentUriAsync(uri).then(cUri => {
        /* if (Platform.OS === 'ios') {
          Sharing.shareAsync(cUri); */
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
            type: 'application/pdf'
         });
      });
}

export async function printAmmoCollection(language: string, shortCaliber: boolean, caliberDisplayNameList: {name:string, displayName:string}[]){
console.log("HELLO THIS IS AMMO COLLECTION")
  const date:Date = new Date()
  const ammunition = await db.select().from(schema.ammoCollection)
  const dateOptions:Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: "2-digit",
      minute: "2-digit"
    };
  const generatedDate:string = date.toLocaleDateString(dateLocales[language], dateOptions)
  const excludedKeys = ["images", "createdAt", "lastModifiedAt", "lastTopUpAt", "id", "tags", "remarks", "manufacturingDate", "originCountry", "currentStock", "criticalStock", "previousStock"];
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body>
    <div class="bodyContent">
      <h1>${pdfTitleAmmo[language]}</h1>
        <table>
        <thead>
          <tr>
          ${ammoDataTemplate.map(data=>{return excludedKeys.includes(data.name) ? null : `<th>${data[language]}</th>`}).join("")}
          </tr>
        </thead>
          <tbody>
              ${ammunition.map(ammo =>{
                return `<tr>${ammoDataTemplate.map(data=>{return data.name in ammo && !excludedKeys.includes(data.name) ? `<td>${data.name === "caliber" ? getShortCaliberNameFromString(ammo[data.name], caliberDisplayNameList, shortCaliber) : ammo[data.name]}` : !(data.name in ammo) && !excludedKeys.includes(data.name) ? `<td></td>`: null}).join("")}</tr>`}).join("")}
          </tbody>
      </table>
    </div>
      
   </body>
   <div class="footer">${pdfFooter[language]}, ${generatedDate}</div>
   <style>
   @page {
     size: A4 landscape;
     margin:${commonStyles.allPageMargin};
   }
   body{
     display: flex;
     justify-content: center;
     align-items: flex-start;
     align-content: flex-start;
     margin: 0;
     padding: 0;
     font-family: "Helvetica";
   }
   h1{
     position: relative;
     width: 100%;
     text-align: left;
     margin: 0;
     padding: 0;
     font-size: ${commonStyles.allTitleFontSize};
   }
   .legend{
     width: 100%;
     text-align: left;
     font-size: ${commonStyles.allSubtitleFontSize};
   }
   .bodyContent{
     width: 100%;
     padding: 0;
     box-sizing: border-box;
   }
 table {
     position: relative;
     margin: ${commonStyles.tableVerticalMargin} 0;
     width: 100%;
     font-size: ${commonStyles.allTableFontSize};
     border-collapse: collapse;
 }

 tr {
   position: relative;
     padding: ${commonStyles.tableRowVerticalPadding} 0;
     width: 100%;
 }
 tr:nth-child(even){
     background-color: #f5f5f5;
 }
 td {
     padding: ${commonStyles.tableCellPadding};
     vertical-align: top;
 }
 th{
   text-align: left;
   padding: ${commonStyles.tableCellPadding};
 }
 th, td{
   border: 1px solid #ddd;
 }
 .hidden{
   color: transparent;
 }
 .footer{
     position: fixed;
     bottom: 0;
     width: ${commonStyles.footerWidth};
     font-size: ${commonStyles.footerFontSize};
     border-top: ${commonStyles.footerTopBorder};
     padding-top: ${commonStyles.footerPaddingTop};
     margin-top: ${commonStyles.footerMarginTop};
     display: flex;
     justify-content: center;
     align-items: center;
     align-content: center;
 }
   </style>
  </html>
  `;

  console.log("finished HTML")
      
      if (Platform.OS === 'ios') {
        const file = await Print.printToFileAsync({
          html: html,
          height:595, 
          width:842, 
          margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS},
          base64: true
        });
        console.log(file.uri);
        await shareAsync(file.uri);
      } else if(Platform.OS === "android"){
        console.log("android")
        const { uri } = await Print.printToFileAsync({html, height:595, width:842, margins: {top: commonStyles.allPageMarginIOS, right: commonStyles.allPageMarginIOS, bottom: commonStyles.allPageMarginIOS, left: commonStyles.allPageMarginIOS}});
        console.log('File has been saved to:', uri);
        const cUri = await FileSystem.getContentUriAsync(uri)
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1,
          type: 'application/pdf'
        });
      };
    
}