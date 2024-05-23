import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import { GunType } from '../interfaces';
import { checkBoxes, gunDataTemplate, gunRemarks, gunTags } from '../lib/gunDataTemplate';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { pdfFooter } from '../lib/textTemplates';
import { dateLocales } from '../configs';



const getTranslation = (key: string, language: string): string => {
    const data = gunDataTemplate.find(item => item.name === key);
    const remarks = gunRemarks.name === key ? gunRemarks[language] : null
    const boxes = checkBoxes.find(item => item.name === key);
    const tags = gunTags.name === key ? gunTags[language] : null
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

console.log(gun)
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
        <table>
            <tbody>
                ${Object.entries(gun).map(entry =>{
                    const excludedKeys = ["images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks"];
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
  const excludedKeys = ["images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks", "manufacturingDate", "originCountry", "paidPrice", "shotCount", "mainColor"];
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body>
    <div class="bodyContent">
      <h1>List of Göns</h1>
        <table>
        <thead>
          <tr>
          ${gunDataTemplate.map(data=>{return excludedKeys.includes(data.name) ? null : `<th>${data[language]}</th>`}).join("")}
          </tr>
        </thead>
          <tbody>
              ${guns.map(gun =>{
                return `<tr>${Object.entries(gun).map(entry=>{return excludedKeys.includes(entry[0]) ? null :`<td>${entry[1] ? entry[1] : " "}</td>`}).join("")}</tr>`}).join("")}
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