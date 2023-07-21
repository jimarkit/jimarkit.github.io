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
        let date = new Date();
        this.#RefreshDates(date.getFullYear(), date.getMonth());

        this.#domPrevMonth.addEventListener("click", event => 
        {
            this.#dateSelected = new Date(this.#dateSelected.getFullYear(), this.#dateSelected.getMonth() - 1, this.#dateSelected.getDate());
            this.#RefreshDates(this.#dateSelected.getFullYear(), this.#dateSelected.getMonth());
        })

        this.#domNextMonth.addEventListener("click", event => 
        {
            this.#dateSelected = new Date(this.#dateSelected.getFullYear(), this.#dateSelected.getMonth() + 1, this.#dateSelected.getDate());
            this.#RefreshDates(this.#dateSelected.getFullYear(), this.#dateSelected.getMonth());
        })
    }

    #RefreshDates(nYear, nMonth)
    {
        if (nMonth == -1)
        {
            nYear = nYear - 1;
            nMonth = 11;
        }
        else if (nMonth == 12)
        {
            nYear = nYear + 1;
            nMonth = 0;
        }
    
        let date = new Date(nYear, nMonth, 1)
        let dateLastDay = new Date(nYear, nMonth, this.#arrNumOfDays[date.getMonth()])
        let dayToLeft = date.getDay()
        let dayToRight = 7 - dateLastDay.getDay()

        while (this.#domDates.children.length > 0)
        {
            this.#domDates.removeChild(this.#domDates.children[0]);
        }
    
        for (let index = 0; index < this.#arrNumOfDays[date.getMonth()]; index++)
        {
            let nodeCloned = this.#domTemplateDate.cloneNode();
            nodeCloned.innerText = (index + 1).toString()
            nodeCloned.onclick = () => {
                this.#dateSelected = new Date(nYear, nMonth, index + 1);
                console.log(this.#dateSelected);
                this.#RefreshDates(nYear, nMonth)
            }
            this.#domDates.append(nodeCloned)
        }
    
        for (let index = 0; index < dayToLeft; index++) 
        {
            let nodeCloned = this.#domTemplateDate.cloneNode();
            let nPrevMonth = date.getMonth() > 0 ? date.getMonth() - 1 : 11;
            nodeCloned.innerText = (this.#arrNumOfDays[nPrevMonth] - index).toString()
            nodeCloned.classList.add("calendar-date-dim")
            nodeCloned.onclick = () => {
                this.#dateSelected = new Date(nYear, nMonth - 1, this.#arrNumOfDays[date.getMonth() - 1] - index);
                console.log(this.#dateSelected);
                this.#RefreshDates(nYear, nMonth - 1)
            }
            this.#domDates.insertBefore(nodeCloned, this.#domDates.children[0])
        }
    
        for (let index = 0; index < dayToRight - 1; index++)
        {
            let nodeCloned = this.#domTemplateDate.cloneNode();
            nodeCloned.innerText = (index + 1).toString()
            nodeCloned.classList.add("calendar-date-dim")
            nodeCloned.onclick = () => {
                this.#dateSelected = new Date(nYear, nMonth + 1, index + 1);
                console.log(this.#dateSelected);
                this.#RefreshDates(nYear, nMonth + 1)
            }
            this.#domDates.append(nodeCloned)
        }

        this.#domDates.children[dayToLeft - 1 + this.#dateSelected.getDate()].classList.add("calendar-date-hover");
        this.#domMonth.innerText = this.#arrMonths[nMonth];
        this.#domYear.innerText = this.#dateSelected.getFullYear();
    }
}

class ThemeHandler
{
    #domRoot = document.querySelector(":root");
    get domRoot()
    {
        return this.#domRoot;
    }

    #bIsLightTheme = true;
    get bIsLightTheme()
    {
        return this.#bIsLightTheme;
    }

    #strBlack = "#000";
    #strWhite = "#fff";

    constructor()
    {
        this.#CheckPrefersColorScheme();
        this.#UpdateTheme();
    }

    #CheckPrefersColorScheme()
    {
        let strBackgroundColor = getComputedStyle(this.#domRoot).getPropertyValue("--background-color");
        this.#bIsLightTheme = strBackgroundColor == this.#strWhite;
        return this.#bIsLightTheme;
    }

    #UpdateTheme()
    {
        if (this.#bIsLightTheme)
        {
            this.#domRoot.style.setProperty("--primary-color", this.#strBlack);
            this.#domRoot.style.setProperty("--background-color", this.#strWhite);
        }
        else
        {
            this.#domRoot.style.setProperty("--primary-color", this.#strWhite);
            this.#domRoot.style.setProperty("--background-color", this.#strBlack);
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
class CustomThemeHandler extends ThemeHandler
{
    #strDimLight = "#ccc";
    #strDimDark = "#777";

    constructor()
    {
        super();
        this.#UpdateTheme();
    }

    #UpdateTheme()
    {
        if (super.bIsLightTheme)
        {
            super.domRoot.style.setProperty("--dim-color", this.#strDimLight);
        }
        else
        {
            super.domRoot.style.setProperty("--dim-color", this.#strDimDark);
        }
    }

    Toggle()
    {
        super.Toggle();
        this.#UpdateTheme();
    }
}

let HandlerTheme = new CustomThemeHandler();
document.querySelector(".container-theme-toggler").addEventListener("click", () => HandlerTheme.Toggle())

let HandlerCalendar = new Calendar();
