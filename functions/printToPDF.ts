import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import { AmmoType, GunType } from '../interfaces';
import { checkBoxes, gunDataTemplate, gunRemarks } from '../lib/gunDataTemplate';
import { newTags, pdfTitleAmmo } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { pdfFooter, pdfTitle } from '../lib/textTemplates';
import { dateLocales } from '../configs';
import { ammoDataTemplate, ammoRemarks } from '../lib/ammoDataTemplate';



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

export async function printSingleGun(gun:GunType, language: string){

    let imgs: null | string[] = null
    if(gun.images && gun.images.length !== 0){
        imgs = await Promise.all(gun.images.map(async image =>{
            return await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
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
    const excludedKeys = ["images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks", "lastCleanedAt", "lastShotAt"];
    const art5Keys = checkBoxes.map(checkBox => checkBox.name)

    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body>
      <div class="bodyContent">
        <h1>${gun.manufacturer ? gun.manufacturer : ""} ${gun.model}</h1>
        ${gun.images && gun.images.length !== 0 ? `<div class="imageContainer">${imgs.map(img => {return `<div class="image" style="background-image: url(data:image/jpeg;base64,${img});"></div>`}).join("")}</div>`: ""}
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
      </div>
        
     </body>
     <div class="footer">${gun.manufacturer ? gun.manufacturer : ""} ${gun.model}: ${pdfFooter[language]}, ${generatedDate}</div>
      <style>
      @page {
        size: A4;
        margin: 15mm; /* Set your desired margin here */;
      }
      body{
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        align-content: flex-start;
        margin: 0;
        padding: 0;
      }
      h1{
        position: relative;
        width: 100%;
        text-align: left;
        margin: 0;
        padding: 0;
      }
      hr{
        width: 100%;
      }
      .bodyContent{
        position: relative;
        width: 100%;
        height: calc(100% - 15mm);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        page-break-after: always;
      }
      .imageContainer{
        position: relative;
        width: 100%;
        aspect-ratio: 30/10;
        display: flex;
        gap: 20px;
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
        gap: 10px;
    }
        .tag{
            position: relative;
            border: 1px solid black;
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
        }
    table {
        position: relative;
        margin: 20px 0;
        width: 100%;
        font-size: 20px;
        border-collapse: collapse;
    }
    .art5container{
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
    }
    .art5{
      font-size: 10px;
    }
    table > tbody > tr {
        padding: 5px 0;
    }
    table > tbody > tr:nth-child(even){
        background-color: #f5f5f5;
    }
    table > tbody > tr > td {
        padding: 5px;
        
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
        width: 100%;
        font-size: 8px;
        border-top: 1px solid grey;
        padding-top: 5px;
        margin-top: 5mm;
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

export async function printSingleAmmo(ammo:AmmoType, language: string){

  let imgs: null | string[] = null
  if(ammo.images && ammo.images.length !== 0){
      imgs = await Promise.all(ammo.images.map(async image =>{
          return await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
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
  const excludedKeys = ["images", "createdAt", "lastModifiedAt", "lastTopUpAt", "id", "tags", "remarks", "previousStock", "currentStock", "criticalStock"];
  const art5Keys = checkBoxes.map(checkBox => checkBox.name)

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body>
    <div class="bodyContent">
      <h1>${ammo.manufacturer ? ammo.manufacturer : ""} ${ammo.designation}</h1>
      ${ammo.images && ammo.images.length !== 0 ? `<div class="imageContainer">${imgs.map(img => {return `<div class="image" style="background-image: url(data:image/jpeg;base64,${img});"></div>`}).join("")}</div>`: ""}
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
    </div>
      
   </body>
   <div class="footer">${ammo.manufacturer ? ammo.manufacturer : ""} ${ammo.designation}: ${pdfFooter[language]}, ${generatedDate}</div>
    <style>
    @page {
      size: A4;
      margin: 15mm; /* Set your desired margin here */;
    }
    body{
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      margin: 0;
      padding: 0;
    }
    h1{
      position: relative;
      width: 100%;
      text-align: left;
      margin: 0;
      padding: 0;
    }
    hr{
      width: 100%;
    }
    .bodyContent{
      position: relative;
      width: 100%;
      height: calc(100% - 15mm);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      page-break-after: always;
    }
    .imageContainer{
      position: relative;
      width: 100%;
      aspect-ratio: 30/10;
      display: flex;
      gap: 20px;
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
      gap: 10px;
  }
      .tag{
          position: relative;
          border: 1px solid black;
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
      }
  table {
      position: relative;
      margin: 20px 0;
      width: 100%;
      font-size: 20px;
      border-collapse: collapse;
  }
  .art5container{
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
  }
  .art5{
    font-size: 10px;
  }
  table > tbody > tr {
      padding: 5px 0;
  }
  table > tbody > tr:nth-child(even){
      background-color: #f5f5f5;
  }
  table > tbody > tr > td {
      padding: 5px;
      
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
      width: 100%;
      font-size: 8px;
      border-top: 1px solid grey;
      padding-top: 5px;
      margin-top: 5mm;
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

export async function printGunCollection(guns:GunType[], language: string){

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
  const excludedKeys = ["images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks", "manufacturingDate", "originCountry", "paidPrice", "shotCount", "mainColor", "lastCleanedAt", "lastShotAt"];
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
          ${gunDataTemplate.map(data=>{return excludedKeys.includes(data.name) ? "" : `<th>${data[language]}</th>`}).join("")}
          </tr>
        </thead>
          <tbody>
              ${guns.map(gun =>{
                return `<tr>${gunDataTemplate.map(data=>{return data.name in gun && !excludedKeys.includes(data.name) ? `<td>${gun[data.name]}</td>` : !(data.name in gun) && !excludedKeys.includes(data.name) ? `<td></td>`: `""`}).join("")}</tr>`}).join("")}
          </tbody>
      </table>
    </div>
      
   </body>
   <div class="footer">${pdfFooter[language]}, ${generatedDate}</div>
    <style>
    @page {
      size: A4 landscape;
      margin: 15mm; /* Set your desired margin here */;
    }
    body{
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      margin: 0;
      padding: 0;
    }
    h1{
      position: relative;
      width: 100%;
      text-align: left;
      margin: 0;
      padding: 0;
    }
    .bodyContent{
      position: relative;
      width: 100%;
      height: calc(100% - 15mm);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      page-break-after: always;
    }
    .imageContainer{
      position: relative;
      width: 100%;
      aspect-ratio: 30/10;
      display: flex;
      gap: 20px;
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
      gap: 10px;
      margin: 10px 0 20px 0;
  }
      .tag{
          position: relative;
          border: 1px solid black;
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
      }
  table {
      position: relative;
      margin: 20px 0;
      width: 100%;
      font-size: 20px;
      border-collapse: collapse;
  }

  tr {
    position: relative;
      padding: 5px 0;
      width: 100%;
  }
  tr:nth-child(even){
      background-color: #f5f5f5;
  }
  td {
      padding: 5px;
  }
  th, td{
    border: 1px solid #ddd;
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
      width: 100%;
      font-size: 8px;
      border-top: 1px solid grey;
      padding-top: 5px;
      margin-top: 5mm;
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
  }
    </style>
  </html>
  `;


      // On iOS/android prints the given html. On web prints the HTML from the current page.
      const { uri } = await Print.printToFileAsync({html, height:595, width:842});
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

export async function printAmmoCollection(ammunition:AmmoType[], language: string){

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
          ${ammoDataTemplate.map(data=>{return excludedKeys.includes(data.name) ? "" : `<th>${data[language]}</th>`}).join("")}
          </tr>
        </thead>
          <tbody>
              ${ammunition.map(ammo =>{
                return `<tr>${ammoDataTemplate.map(data=>{return data.name in ammo && !excludedKeys.includes(data.name) ? `<td>${ammo[data.name]}</td>` : !(data.name in ammo) && !excludedKeys.includes(data.name) ? `<td></td>`: `""`}).join("")}</tr>`}).join("")}
          </tbody>
      </table>
    </div>
      
   </body>
   <div class="footer">${pdfFooter[language]}, ${generatedDate}</div>
    <style>
    @page {
      size: A4 landscape;
      margin: 15mm; /* Set your desired margin here */;
    }
    body{
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      margin: 0;
      padding: 0;
    }
    h1{
      position: relative;
      width: 100%;
      text-align: left;
      margin: 0;
      padding: 0;
    }
    .bodyContent{
      position: relative;
      width: 100%;
      height: calc(100% - 15mm);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      page-break-after: always;
    }
    .imageContainer{
      position: relative;
      width: 100%;
      aspect-ratio: 30/10;
      display: flex;
      gap: 20px;
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
      gap: 10px;
      margin: 10px 0 20px 0;
  }
      .tag{
          position: relative;
          border: 1px solid black;
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
      }
  table {
      position: relative;
      margin: 20px 0;
      width: 100%;
      font-size: 20px;
      border-collapse: collapse;
  }

  tr {
    position: relative;
      padding: 5px 0;
      width: 100%;
  }
  tr:nth-child(even){
      background-color: #f5f5f5;
  }
  td {
      padding: 5px;
  }
  th, td{
    border: 1px solid #ddd;
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
      width: 100%;
      font-size: 8px;
      border-top: 1px solid grey;
      padding-top: 5px;
      margin-top: 5mm;
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
  }
    </style>
  </html>
  `;


      // On iOS/android prints the given html. On web prints the HTML from the current page.
      const { uri } = await Print.printToFileAsync({html, height:595, width:842});
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