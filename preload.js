// preload.js

const storage = require('electron-json-storage')
const os = require('os');
const { resourceLimits } = require('worker_threads');
const { nativeImage } = require('electron');
      
const imageBackground = nativeImage.createFromPath('images/1613314229_126-p-sine-fioletovii-gradient-fon-146.jpg');
const cat = nativeImage.createFromPath('images/imgs_touch-1.png');
const logotype = nativeImage.createFromPath('images/29961a3043a08c1a504dfb46906cb223-removebg-preview-1.jpg');

let step, counter, hidden_opened, last_page;
const Controller =
  {
    params: undefined,
  
    '1_act': () =>
    {
      console.log("1_act");
      storage.set('step', 2);
      location.href = "file://";
    },
  
    '2_act': function()
    {
      if(document.querySelector('center') != null)
        return;

      console.log(imageBackground.toDataURL());
      // add background
      let image = document.createElement('image');
      let div = document.createElement('div');
      div.prepend(image);
      image.setAttribute('width', window.innerWidth / 3 + 'px');
      image.setAttribute('height', window.innerHeight / 3 + 'px');
      image.setAttribute('src', imageBackground.toDataURL());
      document.body.prepend(div);

      image = document.createElement('image');
      div = document.createElement('div');
      div.prepend(image);
      image.setAttribute('width', window.innerWidth / 3 + 'px');
      image.setAttribute('height', window.innerHeight / 3 + 'px');
      image.setAttribute('src', cat.toDataURL());
      document.body.prepend(div);

      image = document.createElement('image');
      div = document.createElement('div');
      div.prepend(image);
      image.setAttribute('width', window.innerWidth / 3 + 'px');
      image.setAttribute('height', window.innerHeight / 3 + 'px');
      image.setAttribute('src', logotype.toDataURL());
      document.body.prepend(div);



      const center = document.createElement('center');
      document.body.append(center);

      let span = document.createElement('span');
      span.value = "Введите строку запроса";
      center.append(span);
  
      let input = document.createElement('input');
      center.append(document.createElement('br'));
      center.append(input);
  
      let button = document.createElement('button');
      button.textContent = "Извлечь ссылки";

      console.log("this in function: " + this);
      const thisObj = this;

      button.addEventListener("click", function()
      {
          thisObj.params = input.value;
          storage.set('params', input.value);
          thisObj[`3_act`]();
      });
      center.append(document.createElement('br'));
      center.append(button);
    },
  
    '3_act': () =>
    {
      storage.set('step', 4);
      location.href = 'https://www.google.ru';
    },
  
    '4_act': () =>
    {
      document.querySelector('input[class=input-text]').value = Controller.params;
      setTimeout( () => document.querySelector('input[type=submit]').click(), 100 );
      storage.set('step', 5);
    },

  
    '5_act': () =>
     {
       console.log("5_act");
       let n = document.querySelector("span#xjs")?.children[1]?.children[0]?.children[0]?.children[document.querySelector("span#xjs")?.children[1]?.children[0]?.children[0]?.children?.length - 2]?.textContent;
       
       n != undefined && (n = Number(n));
      
       if(hidden_opened || last_page == n)
       {
        storage.set('step', 6);
        return;
       }

        if(document.querySelector("span#xjs")?.children[1]?.children[0]?.children[0]?.children[document.querySelector("span#xjs")?.children[1].children[0].children[0].children.length - 2].getAttribute("class") == null)
        {
          document.querySelector("span#xjs").children[1].children[0].children[0].children[document.querySelector("span#xjs").children[1].children[0].children[0].children.length - 2].children[0].click();
          storage.set("last_page", Integer(document.querySelector("span#xjs").children[1].children[0].children[0].children[document.querySelector("span#xjs").children[1].children[0].children[0].children.length - 2].textContent));
        }
        else
        {  
          storage.set('step', 6);
          try
          {
            if(document.querySelector('p#ofr')?.children[0]?.children[1]?.click != undefined)
            {
              document.querySelector('p#ofr').children[0].children[1].click();
            } else
            {
              storage.set('hidden_opened', true);
              storage.set('step', 3);
            }
          } catch(ex)
          {
            console.log(ex);
          }
        }
    },

    '6_act': () =>
    {
      try
      {
        let result = "";
        document.querySelector('div#search').children[0].children[1].querySelectorAll('a').forEach( (item) => 
        {
          if(item != undefined && item != "undefined")
          result += item.href + "\n";
        } );

        storage.set(`hrefs_1_${counter}`, result);
        storage.set('counter', ++counter);
      } catch(ex)
      {
        console.log(ex)
      }

      if(undefined != document?.querySelector('div[role=navigation] tr[valign=top]')?.children[document?.querySelector('div[role=navigation] tr[valign=top]')?.children?.length - 1]?.children[0]?.children[1]?.click)
        document.querySelector('div[role=navigation] tr[valign=top]').children[document.querySelector('div[role=navigation] tr[valign=top]').children.length - 1].children[0].children[1].click();
      else
        storage.set('step', 7);
    },
  
    '7_act': () =>
    {
      let result = "";
      for(let i = 1; i > 0; i++)
      {
        let oper = true;
        storage.get(`hrefs_1_${i}`, function(err, data)
        {
          if(err)
          {
            oper = false;
            return;
          }

          result += data;
        });
        if(!oper)
          break;
      }
      console.log("Result: \n result");
      storage.set('step', 8);
    },
  
    '8_act': () =>
    {
  
    },
  
    '9_act': () =>
    {
  
    },
  
    '10_act': () =>
    {
  
    },

    // custom methods
  
    GetNextStep()
    {
      console.log("GetNextStep() " + step);
      this[`${step}_act`]();
    },
  
    RunStep(step)
    {
      console.log("RunStep " + step);
      this[`${step}_act`].apply(this);
    }
  }

storage.setDataPath(os.tmpdir());

window.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded");
  
storage.get('params', function(err, data)
{
  if(err)
   console.log(err);

  Controller.params = data;
  console.log("params:" + data);
})

storage.get('step', function(err, data)
{
  if(err)
   console.log(err);

  step = data;
  console.log("step: " + data);
})

storage.get('hidden_opened', function(err, data)
{
  if(err)
   console.log(err);

  hidden_opened = data;
  console.log("hidden_opened: " + hidden_opened);
})

storage.get('counter', function(err, data)
{
  if(err)
   console.log(err);

  counter = data;
  console.log("counter: " + counter);
})

storage.get('last_page', function(err, data)
{
  if(err)
   console.log(err);

   last_page = data;
  console.log("last_page: " + counter);
})

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])

    
  setTimeout( () => Controller.GetNextStep.apply(Controller), 400 );
  
  setTimeout( () => setInterval( () => Controller.GetNextStep.apply(Controller), 7000 ), 4000 );
  }
})