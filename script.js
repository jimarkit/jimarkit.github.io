const RegisterServiceWorker = async () => 
{
    if ("serviceWorker" in navigator) 
    {
      try
      {
        const registration = await navigator.serviceWorker.register("/sw.js", 
        {
          scope: "/",
        });
        if (registration.installing) 
        {
          console.log("Service worker installing");
        } 
        else if (registration.waiting) 
        {
          console.log("Service worker installed");
        } 
        else if (registration.active) 
        {
          console.log("Service worker active");
        }
      } 
      catch (error) 
      {
        console.error(`Service worker failed registration with ${error}`);
      }
    }
};
RegisterServiceWorker();
  

class Calendar
{
    #arrNumOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    #arrMonths = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    #dateSelected = new Date();

    #domYear = document.querySelector(".calendar-year");
    #domMonth = document.querySelector(".calendar-month");
    #domDates = document.querySelector(".calendar-dates");
    #domTemplateDate = this.#domDates.children[0].cloneNode();

    #domPrevMonth = document.querySelector(".btn-prev-month")
    #domNextMonth = document.querySelector(".btn-next-month")

    constructor()
    {
        this.#RefreshCalendar();

        this.#domPrevMonth.addEventListener("click", event => 
        {
            this.#SelectDate(this.#dateSelected.getFullYear(), this.#dateSelected.getMonth() - 1, this.#dateSelected.getDate());
            this.#RefreshCalendar();
        })

        this.#domNextMonth.addEventListener("click", event => 
        {
            this.#SelectDate(this.#dateSelected.getFullYear(), this.#dateSelected.getMonth() + 1, this.#dateSelected.getDate());;
            this.#RefreshCalendar();
        })
    }

    #RefreshCalendar()
    {
        let nYear = this.#dateSelected.getFullYear() 
        let nMonth = this.#dateSelected.getMonth() 
        let nDate = this.#dateSelected.getDate() 

        let date = new Date(nYear, nMonth, 1)
        let dateLastDay = new Date(nYear, nMonth, this.#arrNumOfDays[nMonth])
        let dayToLeft = date.getDay()
        let dayToRight = 7 - dateLastDay.getDay()

        while (this.#domDates.children.length > 0)
        {
            this.#domDates.removeChild(this.#domDates.children[0]);
        }
    
        for (let index = 0; index < this.#arrNumOfDays[nMonth]; index++)
        {
            let nodeCloned = this.#domTemplateDate.cloneNode();
            nodeCloned.innerText = (index + 1).toString()
            nodeCloned.onclick = () => {
                this.#SelectDate(nYear, nMonth, index + 1);
                this.#RefreshCalendar();
            }
            this.#domDates.append(nodeCloned)
        }
    
        for (let index = 0; index < dayToLeft; index++) 
        {
            let nodeCloned = this.#domTemplateDate.cloneNode();
            nodeCloned.innerText = this.#arrNumOfDays[nMonth > 0 ? nMonth - 1 : 11] - index;
            nodeCloned.classList.add("calendar-date-dim");
            nodeCloned.onclick = () => {
                this.#SelectDate(nYear, nMonth - 1, this.#arrNumOfDays[nMonth > 0 ? nMonth - 1 : 11] - index);
                this.#RefreshCalendar();
            }
            this.#domDates.insertBefore(nodeCloned, this.#domDates.children[0])
        }
    
        for (let index = 0; index < dayToRight - 1; index++)
        {
            let nodeCloned = this.#domTemplateDate.cloneNode();
            nodeCloned.innerText = (index + 1).toString()
            nodeCloned.classList.add("calendar-date-dim")
            nodeCloned.onclick = () => {
                this.#SelectDate(nYear, nMonth + 1, index + 1);
                this.#RefreshCalendar();
            }
            this.#domDates.append(nodeCloned)
        }

        this.#domDates.children[dayToLeft - 1 + nDate].classList.add("calendar-date-hover");
        this.#domMonth.innerText = this.#arrMonths[nMonth];
        this.#domYear.innerText = nYear;
    }

    #SelectDate(nYear, nMonth, nDate)
    {
        if (nMonth < 0)
        {
            nYear = nYear - 1;
            nMonth = 11;
        }
        else if (nMonth > 11)
        {
            nYear = nYear + 1;
            nMonth = 0;
        }
        this.#dateSelected = new Date(nYear, nMonth, nDate);
    }
}

class ThemeHandler
{
    #bIsLightTheme = true;

    #domRoot = document.querySelector(":root");
    #domThemeToggler = document.querySelector(".container-theme-toggler");

    #strBlack = "#000";
    #strWhite = "#fff";
    #strThemeLight = "Light";
    #strThemeDark = "Dark";
    
    constructor()
    {
        this.#CheckPrefersColorScheme();
        this.#UpdateTheme();
    }

    #CheckPrefersColorScheme()
    {
        this.#bIsLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
        return this.#bIsLightTheme;
    }

    #UpdateTheme()
    {
        if (this.#bIsLightTheme)
        {
            this.#domRoot.style.setProperty("--primary-color", this.#strBlack);
            this.#domRoot.style.setProperty("--background-color", this.#strWhite);
            this.#domThemeToggler.innerText = this.#strThemeDark;
        }
        else
        {
            this.#domRoot.style.setProperty("--primary-color", this.#strWhite);
            this.#domRoot.style.setProperty("--background-color", this.#strBlack);
            this.#domThemeToggler.innerText = this.#strThemeLight;
        }
        return this.#bIsLightTheme;
    }

    Toggle()
    {
        this.#bIsLightTheme = !this.#bIsLightTheme;
        this.#UpdateTheme();
        return this.#bIsLightTheme;
    }
}

let HandlerTheme = new ThemeHandler();
document.querySelector(".container-theme-toggler").addEventListener("click", () => HandlerTheme.Toggle())

let HandlerCalendar = new Calendar();
