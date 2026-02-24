import { useEffect, useState } from "react";
import GameTile from "../Components/gameTile";
import FloatingActionButton from "../Components/FloatingActionButton";
import KonamiCodeModal from "../Components/KonamiCodeModal";
import "./Catalog.css";
import axios from "axios";
import Constants from "../Shared/Constants";
import { gamesModel } from "../Shared/Models";
import { loadRazorpayScript } from "../Utils/loadRazorpayScript";
import logo from "/cusic-logo.png";
import Modal from "../Components/Modal";

type KonamiCode = {
  gameName: string;
  gameId: string;
  konamiCode: string;
};

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konamiCodes, setKonamiCodes] = useState<KonamiCode[]>([]);
  const [showArcadeIdModal, setShowArcadeIdModal] = useState(false);
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const arcadeId = params.get('arcade_id');

    if (arcadeId) {
      sessionStorage.setItem('arcade_id', arcadeId);
    }

    fetchGames();

    const savedCodes = localStorage.getItem("konamiCodes");
    if (savedCodes) {
      try {
        const parsedCodes = JSON.parse(savedCodes);
        if (Array.isArray(parsedCodes)) {
          setKonamiCodes(parsedCodes);
        }
      } catch (error) {
        console.error("Failed to parse konamiCodes from localStorage", error);
      }
    }
  }, []);

  const fetchGames = async () => {
    try {
      if(sessionStorage.getItem("arcade_id") !== null) {
      const response = await axios.get(
        `${Constants.baseUrl}/${Constants.games}?id=${sessionStorage.getItem("arcade_id")}`
      );
      setGames(response.data.games);
    }
    else {
      const response = await axios.get(
        `${Constants.baseUrl}/${Constants.games}?id=`
      );
      setGames(response.data.games);
    }    
  //     setGames([
  //       {
  //         "Name": "Quest for money",
  //         "GameId": 1,
  //         "Price": {
  //           "ByTime": [
  //             {
  //               "Time": 20,
  //               "Price": 100
  //             },
  //             {
  //               "Time": 10,
  //               "Price": 20
  //             }
  //           ],
  //           "ByLevel": null
  //         },
  //         "Thumbnail": "https://cdn.mobygames.com/covers/8054862-uwol-2-quest-for-money-amstrad-cpc-front-cover.jpg"
  //       },
  //       {
  //         "Name": "Excitebike",
  //         "GameId": 3,
  //         "Price": {
  //           "ByTime": null,
  //           "ByLevel": [
  //             {
  //               "Level": 4,
  //               "Price": 50
  //             },
  //             {
  //               "Level": 8,
  //               "Price": 80
  //             }
  //           ]
  //         },
  //     "Thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUTEhIVFRUXFRcXGBcXFxgaGRYVFxcYFxkXFxYaHSggGholHRUXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGzElHyUtLS0tLy8tLS0tLS0tLy0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAQoAvQMBEQACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIEBQYDBwj/xABGEAACAQIDBAYGBgYJBQEAAAABAgMAEQQSIQUGMUETIlFhcYEHMpGhscEUI1JicrI0QkOS0fAWM1NzgsLS4fEVJJOi4iX/xAAbAQABBQEBAAAAAAAAAAAAAAAAAQIDBAUGB//EADcRAAIBAwIDBQYFBAIDAAAAAAABAgMEESExBRJBE1FhcYEUIjIzkaEVQrHB8AZS0eEj8RZTgv/aAAwDAQACEQMRAD8A8NoA6XpQEvQAXoAWgAJoAbmpADNQAXpQFzUAJmpADNQApfuFKA5r2By2vwNtDy07aAG5vCgBM1ACXpAFvSgJegBb0AFAAaAEvSAJQAUALSgFAEzB7Lnlt0cMj3+yjEe0C1Kk2JlIuYNxdosLjCuPxFF/MwpeVrcE09i42R6KsfO+T6mPS/We/wCUH401imrwfoCmP9bjY1/DGzfFhSZAq98vQ5iMP0IwfS4svmznKqhCLW52ANzxPKjIHmGIw7IzIwsysVYdjKbEe0GlAZG5UgjiCCNAdR3HjQCHYiYu7O1rsSTYAC510A0HlQDZzoAW1ABagAtSgJakAKACgAFADrUuBBDQAhpBQpAEoAKACgC+3NwMkuIyxuUYIWBChuBAtbzqxbR5p74ILiXLDbJ6pg9iYliOmxGJKjkhjj+K3q7OKS+Mqwbb+A0WA2ZFFdYhKcxF+klaRieA1Y6eVZs5NvU0YRSWhtdgbNCKGZLPc635eFRsVsuCbanhQJuUWI3vwi/tC34VJ9/CqUr+hHrnyNGHC7mX5cebPGd6t3MLiZpJIlMQeVpLgDMc2pzanmSaz/xKUakpLVdEzV/CYOlGL0a3a6lINwI+PTP+6tdZClQcFJzxlJ7rqcjOVwpyjGm3htaJ9BP6Axf2z+xas+wx7yp7dLuHDcGH+2k9i/wo9hj3h7dLuGy7kQKNZ3Hjk191Q17elSi3KWvoWrSVe4mowhlZWWk3gqk3bj5ux9n8Kwfapdx2seB0VvJ/Ys8DuZBIubPINSLAjl4itmxoqtS55PXU5PjL9kunSgtMJrPidn3Hwy6tNIB3lAPeKtuzprdmWryo9kV82wNmr62LPk6H4Co3Rt1vL9CRV672iSdn7p4KZS0UsrKDa9wNR4rT6dtSmsxbGzuqsHiSRLG4eG+3L+8v+mn+xU+9jPbanchw3Ew32pf3l/00exU/ET22p4AdxcN9qX95f9NL7FT8Q9tqeBlt79ix4ZoxGWsysTmIPAjhp31Su6MabSiW7WtKonzGetVMtjaQAoAWgDVejZ1GLOa9uibgbHivOrdmm6mncVrtpQ17z2vACDKGWN7kW6znt7qddVJZ5JC2tOOOeJIR7EEC1jeqTaLiizSbM3jjysZ5o0IPNlXT20xzS6j1b1JfDFv0ImO9I+yY7hsbEe5CX/IDTiHB4xtDfTCIxCF3AJtZbXHI9asFcLqt9Ejp/wAYopdWysffy5skF/F9fYFNWI8J/ul9v9lefG/7YfV/6NdsTHdLCsjw5XN7hi3IkcNPGtq04HbOKnLLZi3f9QXSk4RSS+pIrosHMZyxGIGp0HfSSnGKzJ4H06U6j5YJt+BQbSxec2sAFLAEG9xfj7q5K/vPaJrTGM9cnpnBeFexUn72ebDemMaDtlYMuwawKg6g+HZzpbC1lWqKTWYp6ica4jC1ouClibXu6fxEveDaP0SHpEjDDMBlBy8eegPdXRz5ban7kdO489dSpd1c1ZNvvZ5/vBvO+KQI0aqA2YWJJ4W+dZ1e6dVYaLlG2VJ5TKCqpZJEOMkVcqyMqk3sGIF/AU+M2lhMa4pvLRebv71Ph06PKHDSZizE3AIUHTyvVmhdSprl3K9a2VR5PSMFj4prmJ1cA2JHI8a1oVIz+F5MqdOUPiR3epBh5/6Rz14fwt8RWZxDeJpWG0jGtWaaA2kAKACgDT7hqDiyFJt0b2PO11tVi2jKU8RePEjqThBZnHmXcel/QMYwAgzFdb6gWNVr+hVVRe85G5wq8snSbqQUcPRbnIbtYlj9bMB4u7H2HT31R7Co9/1NN8Vs4fBH7JFjsnc2BmPTYsLYX0C668Lk05WveyGpx3TEIfVlrsj0QbIcFw804zHUygC/MDo1Xtq6noc5J5eSt339DQlkh/6csMCBWEmdn1NwVNrNm58SKUaem4LZ2Gw0S/VwRBVUMVRUGawBPDmaIpyeEJJpaswu/GJiecPG6sOjFyOAIJ+VbNnGUKeJLGplXbjKeYvJkItsYdnCLMjMb2AIPAX5dwNTqtTbwmiHsamM4Zx2vitOjsCCAc1+Bv2e0edYPFrzmbopaaPJ239NcLcErptpvKxjBWQQF2Cra54X0rHpUpVZqEd2dRc3NO2pOrUeIo0WURRkhRdVuQOZA7a7GhRhQp+6saa+Z5Ze3dW7q5nLKy8eWTyjePbBxUpkClRlAy3vw5/D2Vl16vay5sYLdGl2ccblTUBMW2zd3MTOoeOO6m9iSADY2POrFO2nUWUtCCpcU4PDepX4vDNG7Iw6ykg+I76inBxbTJYyUkmjjemDjWbj7bjg6RJCQHZMthfXUG/ZxFXrOvGnlS6lO7oyqYa6HorGthGSef8ApI9eH8LfEVmcR3j6mlYbSMeazDQG0gBQAUAan0dMRjND+zax07R21as8dpr3Fe5zyad564JcRYj6QAD9+35alq3MNo0pN+X+WR06M95VEiDiwFF2nzX7AT7yTWJdV61FJyp4z3s2rS3p3DajPOO4ixYgE6a+N9Kz6vEaqWiRr0eFUm/eyekejia8Mi8xJfyKj+Bq7w+4lWg3LfJncVtoUKkVBaNfuamTEovrOo8SBWiot7Iym0tzIb57wRNG0CWfMFOdWBAIYG2nPT31oWdtJSU3p4FG6rxceRamDcXBHbpWpgzSh2L6N0hlWSbHwgC90RHdsrAqRfQA2NchXu7eLlFy70dlZ2d0pRqxhth74PUcB6M8HlVjJK4IBGoW4IvyFJG2g1kuVeO3CbSil9y4wW4mAjYMILkcCzu3uLW91TU6cacuaO5QueJXFxB06j919ML/AAXA2TAFKiJACCNFHAi1WHVm92ZypxWyPP8ABehDZiWzmeTxky3/AHQKZkeYP0ibgYfD7Qw8WGiywtFndTI5JyvlYhmJN9V0FT29J1JJdCCvU7OOTljRiMLkhwWCeVMpbqrI9iSbjQHtvxq/WrdhiMFoUqVHt8ym9S1xux1kjCYmAqWCuyEFGBtfXgaspQqw1K8nOlPQ8q3nwaxYmREGVQbqOwEA86xrmChUaWxrW83OmmyrVra1DkmPacLMHiRx+sit7QDXSU3zRTOfmsSaMR6RvXh8H+IrO4jvE0LDaRjyKzDQGUgBQAUAan0cQF8YFUgHo39Y2HLnVqzko1MvuK91FyhhHtmzdzpJLMZY8p45bk2vrbS16vVL2MdMalOFnKWrZl9vwGOeSHiEcgHmRyJ8jXK8Uv5132ckkos7DhFhToR7SLbclrkbhIxYHnXP1JPODoYLQlZ2tZXdQeIViAfG3GlhVlBYTFlThJ5ksj4gcoGp8dedeh8NuIuzpym0tDznilrU9tqRhFvXou/UCPCpZ8TtIfFUX1IIcIvZ7U3+n6jLDtqnP+obKOzb8k/3wXYf03ey3SXm/wDGRMU4F25VxNxNVa8pR2bbO6t4ypUYwlukkeh7L3xwUeHiEmIQOI1BXUsCABYgA9ldDRrQVOOX0RzlbhtzUrScIPDbOGI9JmAX1TI/hGR+a1K7qHQkjwK6e+F6/wCCkxnphgFxHAxP3mA+ANO7WT2iC4XTj8dVeibOcHptwIjBmWQS3OZEUkDU26xte4sfOp4LKzLQzLmEKdRxpvK79isl9NuBeS/0QgqpAklAJAJHVGUFtePlU9OMM6yx6FSbnjRZLn+nWIcAoI0UgEWU8DqOJrRjY0ms5bKEryonjCRlt7Nuh1Y4iYK7IyqfVOg/Vt2XGvfUzVOjDlzjJCnUrT5sZweKSSMxuxJPaTc+01hNt6s2UktjvszCdLKkWYLna1zra/dT6UOeaj3jak+SLl3HreAwxihSMtmKKFva17acK6GlDkio9xh1Jc8nIxfpDPWi8G+IrP4l+UvWH5jIGss0RtIAUAFAGi3D/Sh+BvlVyx+b6FS8+Ue27H2hKMPkV2UDMBbS19fnTr2OKme8Wzlmlgy20pWMhYkkmxJPM27fKuWv4Yqs7Dhk80USgaxWbRzxE2W2ttakpx5siN4HtOo5ikUH3C5Q04paeqbGuSI2KxrWGUHjVijbObIKtxGCyGIxelmsL+2j2WcHqmvNYFp1VWX/ABvPlqVE73Y2q3DSKTNGkmo4ZwkY1Igk30ILYVQblb63Op4dmlWoVzHr8PW+dym31wSxYkhBZWRWA156c+8VsXdOMJ4jtg4ihVnUi3PfJQVVJiz2PtuXDMzR2JZQpzAnQG4trU1KvOk8oiq0Y1FiQu1tuzYkASsCFJIAUC1+PDwpatxOoveCnRhT+Eq6gJTR7l7J6aUvnK9EUcC182v+3vq5Z0e0lnOMFS7rckcY3PSJK3UY5hPSFxi8G+VZfE/y+ppWH5jIXrKNESgAoAWgDQ7ifpY/A/wq3ZfNKt58s9n3dwsjhlVCbEHyI/2qxfLVMisXhNMJ9yMZI1wiqLW6zr2nkLnhauevLadWacTo7C8p0YOM+8zmHYglWPDTXtBtWBWhg6elPKydMVhg4ANxY8qjp1HB5Q+cFJaiiBaO0kKoo7whADoOVtL1ocNvKVCq5Vo8yx3Z1M7idnVuKShRlyvPitPQe1x7v4139vOnUpxnBYysnnd3Tq0qkoTbeHjJS7blUlbMCylgR42/h76w+NTpzlHleWsp/Y7P+k6NanCpzxajLlaffv8A6KwVhHXjxhZT6qEirNG3nVWYLJn3V/Rt5YnJLzZL2fs1y46WMZdbgka6aaA1qWfDJ86dWPu+ZzvE+P0uxat6nveT/dEva2xIZwxaNS/RlFY36uhtbwJrenQhNYa6YOKjXmpZz1yzzfbG7s0DqlukJXN1ATbW1qyKtrOm0t/I06VzCazsV2LwUkVukRkuLjMLXFQzpyh8SwTRnGXwsj0wcanYW55xEaymYIDfTKSdDbtFX6Fk6kVJvBSrXipy5UsnoWEwwjRUFjlUC9gL2HG1a0I8qSMucuZtiStUqGmF9IPGL/F8qy+J/l9TSsPzGQYd9+FZJoiUAFABQBo9wHIxikccrcr8uw1as0nV1K102qeh7Fhp8c3qNIAfs9Ue4CtNxorcoKVZ7Hp0WMRUUu6r1RfMw4214msZxecJGupLGWeUby4LCrmkhxSySNIT0Yt1VJJOoOttKwrqhCOZKWudjpbG5qTag44SW5TJjPte6sx0e411U7xWxnYKTshe0O0MwIGupqOUGh6lk7qbX7xb3g/KrNne1bWp2lPfGNdSreWdK7p9nU2znTTYo9p4RszPpluPgOVWva3XnzT+J7l21pwo0o0obJYQbFbrkdo+FQ3S9zJNV2O+29vxYXL0gclr2ygHQWvqSO2t3gF5GnRlCXf+qOG/qO1lOvCa7v0f+yJsLelcVOIY4nuwYjgSbC9so7hXQ0r2M5cuMHN1LSUY5zk000LIbOpU9jAg+w1cjJSWUVJRa3OZNOGkPG7NhlIMsauV4X1teo5U4TfvLI6NSUV7rOkWBiT1I0XwUClUIrZCOcnuztTxojGlAjSmlQGI3/8A2X+L5Vl8T/L6mlYfmMfWSaIUAFABQBotwmtjFJJHVfhx4VYtU3U0ILhpQ1PWDjVt6rt+KQ29mtX/AGeu38aXlH/ZT9opJfC36jHxwHCKMeRY++kdi5fFUl6YQK8S2gvXUrsQwZszKCeVhYe6oocGtY9G/Nln8Zu18LS9BhmsNEA8h8asQsLaGsaaIZ8Rup/FVZisRvqT6sNvF7+7LXP3lvC4q8693TGEb1lfzt6XZv3nnOWyfsjeRHC52CyFrBQD26Vl17KUW+VZWDZtuIwmlzvEm9jT4afkTck1mzh1Rqxn3kqwPGxqHLTJMikBQSANKVZk8MG9DD+kCTOiG3qsRfuYf/Ird4ZBRUjnOMy5uXwyTvQZiMPHtAtPYFYWaNyT1XuFNgON1ZuNbFOEpvEUYEpxistnpO92MimnzxNmGVQTYjUX7e61bdpCUIYkjIupxnPMSiNWiqAFAC2oASgBj0oETENYE9lOQGG33nDdFa+mb5Vl8UWOX1NGweeYytZBpBQAUALQBfbj/pa/hb4VbsvmorXfymemqK2jHHEUoC5KAORh1pRTx7acGSaRPsuw8gTaucqx5ZteJu05c0EzgjkEEGxBuD3iomsrDJE2nlF9sjeR0uHvIWYasx0HCqVeyjPWOhp2vEZQ0nrl95tl2ki6dIgJ5XF6xuwlLXlZ0Crxyo5WWW+wdmy412SEglVzHMbCxNvOpqVpKfwoLqv7PFSqbMbv96Pp4sDNO8kdowrFVzE+sBxsO2tW0t5UviZz19eU66xFMibsYKE4DCTJEiuVlR3CjMWRzqTxvYj2V0HD8NPvObv85WCztWmZwUoCWoEFtQAhoA5y0oFHjNodVuryPOn4xqEXzPBiN4582TS1r/KsniU+ZR9TUsqfI2U6ZbG976ZbWtx1v5Vkl8ZQAUAFAF9uR+lp4N8KtWXzUVrv5TPTwa2zHFF+7zNqbKXKSwp873S8wZrcWQed6h9olnSD/Qsq0h1qL0yyvxm0cjWGugN7WFZl1xWpSm4KK+uToeHf07RuaSqym/pg813k1xLm1sxB9oFVFWdb33uyO7tI2tV0YbLGMixbBmPHKPE/wqB3MEXafBbmWrwvUlR7tNzkHkKjd4uiLcP6fn+af2LnYO5TzSAQK8rr1rDKLAHib8qb286mYxRP+F21o1UqVGsPT+ansHo63WxmFxJlmQKjRMhGYE3JUjQfhPtp1vSnCWWQ8Wv7e4o8kHlpp7eZud4MGk2GmjkQOjRtdSSAwtexKkEcORq9BZkkzm5PCbPJ2mQRrDFFHFGpLBYwQMzWuSSSTwFbtG3jS+Exa1eVTc41YIAoABSiBQAEUAVOJx7C4sNL1IoaZI+fXBmMRjiQRbj3011M6FuFuk85M7tr9XzrI4htE0rfqVdZhaCgAoAKAL7cn9LTwb4Vas/morXfymenCtsyBG8VHjeo5Tkto5LFOlB/FPHpki4zE5ACMp1too+JFYvEK04rMo7+OTqOC2sKs+WE3pr8KWde8o3nsb+t4638awFHmOym+VYOcO7kWJJkdnBFlstgLceY763uG2sKtN8z2ZxP9RXMqdwmktY/5Hy4bo2KAkhTYEm5txGvhWPdw5K0o9zOv4ZU7S0pzzukxKrF81notxyptBELC8iOlu0hc/8AkNWrZNTz0MXjUoSt2s6po9xPDStE5Bnzttj007SztF0WHjsSrAKzHQlWsS1uR5Uq0Yj2JOxdtx4nMY83VsDcW434eyt+jXjVzy9DDrUZU8ZLOpyEKUQKAFNAFZisY6uQOA7qkjFNEUptMzuJxr3PDieVJzNaFmNGLWSskqJlpFRtrgvnWZxDaJbt+pXwOgzZlLXUhbNbK3JjobgdlZhaOVABQAUAX25pvi00to3D8NWrP5qK138pnphUH/mtWrSlPaTXkUaFeFLeCl5iZVHZ8ahdpT/PJvzZbjxGvn/iil5RKLaCMZWCC+osB3qCfnXNV6C9olCms92NTvrS7asYVqzw8a5064JGztnNcmZBa2l7cfAVp2HD2pN1oaeJz/GeNqUEraprnXHcTpG6NSUQWAJsNL2FbcacaUXyRwcpUrVK8k6sm/MwuI3p6SS/R2zEA637BfhXMXdNVqkqm2TsuG8Tlb0oW+M40z5sugayzsCRutIY9p4WQA2Eq3IHJuofcTWhb5cNDmuLRSqSz1R9LCrJzh8h+kbBiHaeLjGgEzH97r/5qViELYG35MLnyKrZretfS1+zxqehcSo5x1Ia1CNXGT1tHuARzF/I1vJ5RiNYYtKNClArsfOwawNhYVJBJoinJpmexmKfO3WPGkbw8Is04RlFNohuaYTrQ4SU1j0U+2+C+dZvENolu23ZU1lloKACgAoAvNy/0uP/ABfA1as/mor3Xy2emtGvEj3mr1agvinNpeeCO3u5pclOlFvyyzniFBRsoF8pt48taoV4Wsqb5G2+m7NiyrX0K8XUSjHOuy0KzZ+GlDqxTS+puNBzNVLC1rRrxnyvCNTjPEbepazpc6y1ot/0LqS/KupR58Ue9c00WHZ0axBAOgOhNjx8ar3UpQptxZYtlGU0mjzAGsA2k8PJq9zJJJsR1pT1Bny20Yerbu9YVPZW1OVTVbC3vE7rs/jeum+P0NZt/eP6EYnEeckkjrZQChU66HtrTuKioxwo6P0MihGdeXNKTyvU952BtH6ThoZ7ZeliSS3YWUEi/O16xjWZ83enPCCPa8x/tEik8Pqwh96X8zQxDz+kA9k2DNnw8Ldsa+4W+VdFQlzU4vwMKssVGvEnmpSIr9pyEEWJ8qkgkRVG1sZ/aMzZvWPAc6JaPQnoRUo5ZWTYtB6zj261DOtCPxMtRpy2SIcu2IhwJbwH8arSv6S21Jo282RjtJ39SInv1+VVpcQb+GJap2E57JvyRDxKyubMACOWg4i/wFU61edX4i1CynBuOMPx+pDljykg8qgEnBwk4sZQMCgAoAu9zP0uP/F+U1Zs/mor3XymepCttxT3RkqclsxQKVIa5N7jhSiCFqcIVO8yhsLMPuE/u6/KoLmOaUvImt3ipHzPJ2Fc9g3Cbsfaj4aTpIwpJUr1gSLGx5EdgqWjVlSlzIjq0o1I8sj0fYe3IsSEQlTLkzMMugOgaxPfWxRuI1MLqZVahKm2+hd7x79z4aJbu7A9QBCFtZdNePKoa8aNJczjkmozq1XjmweLYzGSStmld5G+07FmsOWY61kGmP2Z0fSp0vqZhm8PKn0+XnXNsMqZ5Xy7noH9LMFAoSLMwXQBF0HPixFa3tlGmsR+xmey1pvMiq2nvvmACQkd7H5Co3xLHwx+pJ+Gtr3mV30nGTgMMqrrYjT43NRSva89sI1LXgcpR5orR97OUGy3lj6R5jYgm2vL3cqruVSespGjb8JUqXaZxp3Dtk7HQx9JMO8C9rL2mmRgsZZZs+H03S7St5+g/YZjeSQqihQFyi3LXXxojhtj+HulUqzcYpLTH3JmLxUgbKkVx9omwpZNl2tWrRly06efHoZvaM8nSNmsG0vl7hp7jUT3Oeu6tV1Xz6PwIh76QqN5EoAKACgC63N/S4vP8pqzafORXuvlM9TrcMYUUoC0AcnQczSgcmeMcbUNoXDPP9+1QzqyWsUANuRBNY1+lzpruNSyyoNPvM1VEuEnBxy3vGH8Vv8AEU6PMnlEkaE6nwxb9CY2ycQwJZbWF+sddPaae1KW5ajwy4xnGCTh93CQC0gAIvoL/OkVMuUuDuSTlL7D8ZsvDxxsc93sbXYcfAUrjFIdXsbajSb5vexpqWfQwxR5xGNADoBc38afhJZNBwoUKXaKHTu1OkMiSxEsmVTfRgOA50qeUPhOFei3KOF4nHd4/UL4sPeabDYi4a82y9f1OmxR9SB3uPYxpY7D7HWgk/FfdnTaGF6SMoDbhwPG36tEllYHXVF1qLhF4/mxR7tArLIpFjl4HuNRw3MrhKcKs4y3wWOOafNaMKF7T2+FLLPQ0a7uXLFLGO9me2rhnVgXYMW10HZpUbRg31CpTmpVHlshMaQpCUAFABQBc7o/pcXifymrNp85EFz8pnpU+0IY/XlRfFhf2VtSqRjuzIjTlLZFVit78InB2c/dU/E2FQSvaUeuSaNpUfTBV4jfwcIoCSeGY/IVXlxD+2JYhYNvVkDH7cxzKWIWMcOqNdTYWuSb1DK7rNdxo/g8qceeUfr/AIOcey5XF5pnueQPD5VD78viZsW/BFjNR48jsdlxImiodDmeTMbd4UWFSwUMYaXmytf8JnRi6tOTaXTqPbARiPqIpNhYgatwOl+2o+RbI13Rowtu05UtE/3Jcc5zZTGyXFxmtqL24AmnSjKL95YH2fEaV1Nxp9Cq25tORHyLlAK3uRrqSPlUc5POhV4lfVaNTkjtgsQqtCAxsCgub20sOdLujRUYzoJS2aRSbRXCrGwjsX0sdSeIvr4XqOXLjQx7uNnCk40/i+vUvFlIhDKuY5BYdpsKlzobCnJUFKKy8LQbs+SV1PTIq9gHMd4uaSLb3G20q1SL7aKXcg2WFAdV4CRgO7gbe+iOAs1GMZRhspM4bPxaIjBmUWkfifvGkTS3IbavTp02pyS96X6lRsva/RMwa7KSSLcb+fbUcZ4Mq04h2EpKWsWy0jM0maeHDSeqLkqcjD7RbQae+/dUM7yjCWHJJ92dfoTSvW6na06fTDyOkwGNvIJTHAIujzltABIcqkWvcXqs+JU5KLhmXNnGPDcbK7upZy1HGPv9SBvXskYcorYjppCAxAUgKjAFSCeN6Szu5XKcuXCWm/XqUrtSTXPLmZQirpUEoAKACgDvgoyzqobLc2v2UsdyWhS7Wood5fLsWBBeR/aQoqXkS3Nz8Mt6SzUl9Xgj4rEYeMoYlVrHrcTceJpG4rYgrVrWi4uik8PXy82Wxgjm6OQW6puLfA+fwp+FLDNTsaNxyVV01X+PqccRiA2Ijj5KCx/FY2pG/eSIqlVTu4Uu7L9caETeiVhkUEgG5PedKbUKvGaklyxW2pEwzYqRAFJyWtfQaePE0i5mtCrSd9WppR+Hbp/2XUZP0bTj0XL8NSL4TYS5rP8A+f2KbdyQmY3N7qePlUcHmRjcIeK7XgO3pX6xT9y3sJ/jS1B/GV/yxfh+7LTDYmPoEEjKAUAIJ46WPfTk1jU06Vaj7NFVJLVd5HO0cKnqqD4L8zSc0UQe2WVLSC+iH7PnxToFhwkj5QASFYi4HcKrTvaNJJTkl5sgp8SqKmowhnCwSpdlY9oOmYxxIR1QWUO5IuqKNTnPZoaqvi1LtOyWW+uFovHPcu8jq3V1UhnKS+50G5LpP0EkxynDyTZo+GePRk15g2ue+qf4upUe0hH8yjh9z6lVUJxfI5aYb0LSbcnDIkkgBdVwpYhmN458qup0tcEMbX06pqpHitacoxejc/rHLT+n7knssFl+H3NFBsrDQYnpkSOMFfo+UAABxmlZteZQLrWdK4rVqPZybevN6aJL65J1ThGfMtOhQ4zacH0TDgzwXTDxAgyyM4K2YqIUOUNpa7dtX6dCr7RUajLWUuix55ev0IZVIci1Wy6/sVO8u+EU0WKiCsxd16KS1h0QdZMrXN9Dmtp+tVqz4ZUpTpzbxharxxjT7ZI611GcZR79n4bmc3g2z9JcPkyWRE9a+iLa/Ad9adpbezwcM51b+pVrVe0lzYKmrJEFABQAUASNntaVD99fjSx3LFq8V4PxRrNotEFBmtYHS4J18BU8sdTprp0IxTrbdDP7XnjcL0SWC3uQthrbsqKTT2MO+q0qqXYxwl4YRdbNQQwXbszHz5fCpI6RNi0ira2zPzY/F4fMVmjsWXUffXs9lK1nVDq1FTca9L4l91/Nhk0uHmUZiNOROUg8xSZi0NnO1uo++9vRojY/akcadHFYm1hbgO+/M0jkksIr3N/Ro0+zo77abI4YbaT9EESJmstr629wqPtoxWGRULuq6Cp06bemM9CqhmeMjKMri4J569xpql1RkU51KE9NHsbaXcgmSNZ8TIzM6J1YnyKG10kbq3sDoKxHxlzi5xjok3rJZ08FqXKtGc5LtJNsWbdrD4QK8kfThsWkcZZiFaKSO4YheYa4I7VqON9VuG4xfLiDb02af7oY6MKeG1nXHoaLZ8MYmxyQ4dE6ExInQrGJLEkk55brfU3J5Cs6rOTpUZVJt82W+ZvH0jr/ALJ4Jc01FbY2x+5FXb0UAXpbuwxudwJszRRlU+sfotHAHLhepXZzrN8mi7PC93Cby9FzbZ+o1VYxxzd/ft46HPY6ucwMLuBjjiQWyxh1dT0WshHWLWNrcBT7jlWGpJe5yaZeGn722dEuolPPd1z3eRIlx0/QdJM2EibPJCAiuzB5x1omVdA9xmJJIqNUaXa8kFOSwpa4Wkdnr06YwO5pcuXhdPr0OmM2WVxKxySTkTWhkIMUaSRxxOwARSX5etpxPbTKdwpUHOMY+77y3bTbXV6egsqeJ4beuj26L6kTaWzEgw2KlI6WTpBPC8hLsseaIJqx59YX4kCrFtdTncUlHRJYaWib1zsR1KSjTk3r1XkecbY2pJiZOkky5rBeqoUWGg0FdOZpBoAKACgAoAKAFoAfh2s6nsYH30qJKUuWpF+KNXPtbDgdY5rcLC+tTOaOjq8Qtlu8+mSFidp9KuVIXYXB4dhB4C/ZUc6sUtSvVvHXjyU6Ta0+3kJi1xMqkOEjXvIHDt1qGV1F6L7Dq1K9rwxNKEfF4IogRRlfFCw/VS5/2pnazfwx+pXVClCPLUuNO6OWcukwy8Edz942HupMVX1SI+04fT2hKXm8L7EjC41mYLFEiai5ylsvK5ps6aSzKTZYt7uc6ihQpRj3vlzjzHSjEliDJYB8gPqgm17Cw7KauySzjpkkqfiE6ji6mnNyrpl76Y8BJWLpIJNXhIIbgSCbEG1KkoyXLtIZVlKvQqKt8dNrXrhvZl3tTftXkWWPDkOrKymSV2VSumkQIUXHnqaz6HCHCDhOejznCS38dzOqXacuZLXzM7idv4h41iZ+osrSqoA6sjEkkHjxY6X51ows6MJuaWrWH4r+IrOrNrGdNx2yMS0mLjaUdMWlUsrsAHN/1idPbSV4KFCSh7uFphbC05N1FnXU9E2xtDoZcO0hCxTO8EsMyxKwhcgEkx6GNb6E/Ouet6Pa05qKzKKUoyi21zLz6vqaFSXLKOdno08benQqMLvXD9IxRlmPRtKMqdEssTxJ1QADqrZQLG9tatz4fU7GmoR1S1eeVpvX1WSGNxHnlzPTPdlYKDGbwxdG0UMJRfpoxKAnQKEyhLe/uq/Tsp86nUll8nI/POckMq0cYivzZH7Q31meQyxxQRPmzZ1QFycpXV2vfQnlTaXC6cIckpSksYw3p37IJXMm8pJMpsVtWeQAPM7DIqWuQMqkkKQNCASauwt6UHmMVvn1ZDKpKW7INTDAoAKAFoASgAoAKAHRoSQBxJA9tI3hZHQg5yUVu9DQYeAKzRwqhdBdnfW57FHKqkpZSlNvD6I6OjSjCcqNvGLlFaylrr4dx0jjmcKWkcZmZSq2TKwHb2aUjcIt4X7kkI3NWMXObWW1hYjhrx9CEmySxTPJq+YLoTqvEEk6VI6yWeVbFGHDZVHDtamss466rdNkr/p0NoywC3VgbnjIulj7+zhUfaz1x/EW/YbVKDksaNb7yWnh49xw6WFM2UAOYxlsMxD9nA2J8aficsZ2z9iHtbalzciSk46Y1al9HhvzJRkdwcsD9ZVzHReupvcE8qjwo7y2z9C26tSsmo0X7yjl6R95a9Rs7SXJdooxmDAE5iGHMW8KI8uPdTfQSrKs5N1ZQgsp4by0110K7G4tQpRGLlzd3Ite3AAdlTwg2+aWmNkZV1dU405UqT5nJ5lLbPgvArb1OZQX04ef8/zpQAlADnkJNyST2k3pEkthW8jaUQKACgAoAKACgBWoASgAoAKAFoAdDJlYN2EH2G9I1lYH0p8k1NdGn9DRph3WZpUQtmFmjPVdSQDYg+3zqnJrl5JaNHR0ovt3c0FzRktVlJpvvETp1QK7RJZrgu3WAHAWHHTSh9m3lJvyHRd3TpqM5Qjh5Tk9f9keWWLTPiGaxLARraxNybE+NPUZdI/UrVKtBY7Ss3htrlWNXvhkdsbAPVhLHtka/nYU/s6j3l9Cs7u0jrGk5Pvk8jTtqQaIEQfdUfE0dhHrqNfF6y0pqMfJESbGyP6zsfPT2VIqcVsipVu69X45t+pwp5WAGgAZbUAFqAEoAKACgAoAKACgAoAKACgAoAULQAlAC0oCUgD85ve5v23+dGBVJxeUxL0oN5EvQIS9nQs5ZVhaYlSAFzEqxIs1l48DodNaALJdzsdk6RsO0afblZIl7+tIQKQXle+B+H3bjLqj47DhmKqFjzyksxsBdFy8T9qgQqNp4URTSRB84R2QOBYNlJGYDsNqAI1ACUAFABQA5iLDTXme2gBtABQAUAKaAEoAWgBKAFoAn4mfDmOIJE6yAEStnuHN9CB+rpyp+V3CalfTBRaUCTszAtPKkSEBnYKCxsB3ki+lAGo3e3Sw+IYr9NzFRduihfLrwGeTKf8A1pk6ijuWbe1lWy47L9ybtXdyDDm64WWckX+smCKe9ViQZh4PUcbhN4ehdqcIqqPNTal343+jM+d4CmiYXCxEaf1OZh5ys5vVjBlNNPDFwu3cXPLHG2JlCsyrlRsi2J+wll91Mm8RbRNawU60Yy2yaT01Y8/Tvoq9WHDoiIg4XKgs3ib8aSKW5JcVG4xXfq/2+i2M1ueAuIM9uph45JjftUWjHiZGjHnTyoUTXvrxvrft76QBGFjxv4UABFqAEoAkYkxWTow4OX6zMQQXudUAAstraGl0wBwNIB2w+Fd/VXz/AN6a5JbipNk1diy25cPlf46UztojuRnDEbMkTUi47vG1OjUixHFohU8aFABQB3w0GfN10TKjN1iRmy/qrYG7HkKVAcaQBRSgNpAFpQLvcof97B+I/lagEajcjBquFaRgxzOG6vGwuBfuJ8PGqVd5l5HU8KpuFFY3ll6/Q10GIz5QqlkY2dWOYqfDieBsTroLEcBEnkuyp8mXJ4a2e2f2/bwI+3dxEmTpY8rC2rIxOU8wW9Zbdji3fUseaGsWUqsqFw+SvHEuj2f+H6fQo92tiYfASHFYkPM8RvHAFIJPJy3A2Pt491P7fm0ehX/DOyTlB58V0Xdjva69O4wu8u15MXiZcRL60jXI7OQHkBVlLCMOtPmlthLTHkS8P9Vs6RjxxMyxj+7gHSOR2jM8Y8qUiKGkABbn5eNAHfGvGSvRIUARQQWzXcDrMDYWBPLlSvAEekAKALHZOz+kN29Ue/8AnXXuqKpPl0Q6MckvE7UsckIH4jwv3fxpkaedZDnLoiMZcQT/AFnvHP8A4p+IdwmZHSHasiW6Szg+Fx50jpRewKbW4/aOFR16SP8Any8uFJCTi+ViySeqKapyMSgBbUoBagANACUgDqcIXe5X6bB+I/kahimw3axUbRqIWViIwjRto1tCbX0Oo/2NZ04STyzs7WvRqU1GD0WPTTGq3/m5st34GIMnRWCt1V9UaEaM5Fg2hNzluV4i9LBPfBHdyimoc2r9fou76+TNHj5UR2JbLMqqSVJWTUDKC1j0i626wYfeqWTS8zPpRnKKWMxb66rx06Pyw/AxM21ldmEiBkLE3Asbni2XhqdbDL46VW587m5G1lGKcHh/zT/vJUbX3UgnUvEQe0jRh+LT4jwJqSE5R+F6FS4tqNZ8taPLLvX81/mxjt8o+iMGFH7CFQ397L9a/nZlHlV6LzHJylaChUlBPKTxkzlKRD45Ct7G1xY947PdQAy1ACUgCgUAaOaMrCqKQLjU9g5nS976DTjeqqeZ5ZK1oQTAFGpTTS5jN7ipM5/7G4GkKOJTn+yblS6/xhoNAUk2K8L26I2sL60a/wAYEjZ2haxurdxFj4dlvhTZ6ixKzGR5XYVLF5Qx7nGnCBSgLQAUANpAHU4QvNyv02D8R/I1ApUROVsQbEcCOVGMrDHQm4tSTw0eh7k+lLE4TqSWliJuQePAC4PgB7OFR9m4/B9C7K5hWwqy1/uW/qtn9mehy7yYbGKrYPKpVSxiexBk5Lkvw4k20Nxeq9TfGMGlaQwnKUuZPTK3S8eqfn6FTtPAxEI0lsPIQc5QF4i5N1AykhOrqbE2zDSoZJddDWoVqibUPfj0zpLHXffXRFDOehxKYYspkkbKxVgVSCxMr3/uw3vp9GlmWpW4jxGMaS5N3qujXj6dPE802zjTPPLMf2kjP4AkkD2Wq+ciQqQANABQAlIA/pCWzE6k3J773oYGi2nLZUJF1Oh9xBue8VVprVolkyPHjrgkZ7a8k5+ffT3DAmR7Tnhdv/S/xpMC5GNOddW9qc7n50comThhcTnkFge0k9gvpp3mnSjiIJ5ZE2kfrD/Pxp9P4RstyLTxoUoBQAooAbSAT5doXgSHo0GVi2cDrtfkT2VL2nu8o3l1yT9yf02D8R/I1RscUqmlAcGpcgdsLi3RgyOVI5g2pskpaMlpVp03zQeGbTZvpEkEbRzosoINicpu1rAsCCCeHW499QSo/wBrNWjxKGczWGusdM+Hhnw08Cm2Ziz0eMxTm7GLoF/HiLqQPCNJKmjFRWEZdxXlWm5z3Zmr04hEpACgBKQBaAEoAvdnyrLGYmOtv+D8KrzTjLmRJHVYICwmNiHCjszC4PhapXLmWUNxjc6Er2J49G3Cm/zcDjIQQQMtzyCEHypyAn4bD9ChZ/WPu7vGopS53hDkuVFO7XJNWEtCMbSgFIAlADhSgCLc27dP5NIAXpwhoNwT/wDoYb+8/wArU2WxJTWZJGoXbeN5Mttf1Evyty8apKppq2dbOwipPlpRxr358Oo994saDbOoOvERjwPhxpVNvqxkrWC07OP826jV3kxt9JUtf7nA8PO2lLzeLGq3hn5cP9fX0O429j/tngeGXjrb5UztPFk6sl/6o/Tz8fIq/SJtaRoMLDI5Zjnna/IE9GnDuVz/AIqtUM8uWc/xVU43HJBJYSzjvMFUxmgaQAoASkAKAFFADopCpuDY0NZ3AuINqq1hIOBFjx1vxqB02tYkiknuSA0J16Q9vredN9/uF0GNjII9VF27eJ7ONChOW4ZSKjF4tpDc+QqeMVEjbycSlrajX3a217OFPEEBoASkAKAHqtKA1aEAAUohcbo46ODGQyymyK12IBNgVIvYanjTZLKHweJJmqi2jggB/wB2P/DL/Cqfs0jqvx6j/a/sJLi9nsbnGcraQy9/d305UJohqcYt5PLi/sMjxGzhwxTcv2MnLhypXRmyOPFbaO0JfVdCV/1fAc8Wf/BJTPZpd5Z/8gpf2P7GR3t2kmIxLyRk9GAiR3FuoihRpyvYnzq7FYSRzFao6tSU31eSlIoIxKACkASgBaACgBQaUBKAHMo0sb6a9xuRb2AHzoAaRQAooABQA4Dj/GgBFjJ4AnwFJlAAU31FADrUoHKkAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCVh8SyCwta99R/PZSOCYqeBrTsbcNL0cqQZBjm1JFOSwIR6QAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAFzHtoAL0AF6AP/2Q=="
  //   },
  //   {
  //     "Name": "Street Fighter 2",
  //     "GameId": 2,
  //     "Price": {
  //       "ByTime": [
  //         {
  //           "Time": 20,
  //           "Price": 10
  //         },
  //         {
  //           "Time": 30,
  //           "Price": 20
  //         }
  //       ],
  //       "ByLevel": null
  //     },
  //     "Thumbnail": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/SF2_JPN_flyer.jpg/250px-SF2_JPN_flyer.jpg"
  //   }
  // ])
    } catch (error) {}
  };

  // if that game is not there in the arcade list stop the payment

  const normalizePrices = (price: any) => {
    if (price.ByLevel) {
      return price.ByLevel.map((p: any) => ({
        value: `${p.Level} Levels - ₹${p.Price}`,
        Based: "Level",
      }));
    } else if (price.ByTime) {
      return price.ByTime.map((p: any) => ({
        value: `${p.Time} mins - ₹${p.Price}`,
        Based: "Time",
      }));
    }
    return [];
  };

  const handleSubmit = (arcadeId?: string) => {console.log("Arcade ID submitted:", arcadeId);

      if(arcadeId) {
        sessionStorage.setItem('arcade_id', arcadeId);
        fetchGames();
      }
    }

  const handleGamePayment = async (gameData: any) => {
    const gamePrice = Number(gameData.selectedPrice.match(/₹\s*(\d+)/)[1]);
    const timeInMins = Number(gameData.selectedPrice.match(/(\d+)\s*mins/)[1]);

    const arcadeId = sessionStorage.getItem('arcade_id');

    if (arcadeId === null) {
      setShowArcadeIdModal(true);
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const price = gamePrice * 100;

    const result = await axios.get(
      `${Constants.baseUrl}/${Constants.fetchOrder}/${sessionStorage.getItem('arcade_id')}/${price}`
    );

    const order_id: number = result.data.details.id;
    const currency: string = result.data.details.currency;

    const options: any = {
      key: Constants.razorpay_keyId,
      currency: currency,
      name: Constants.razorpay_default,
      order_id: order_id,
      description: `Payment for ${gameData.gameName}`,
      image: logo,

      handler: async (response: any) => {
        const date = new Date();
        const data = {
          paymentDetails: {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          },
          gameStatus:{
            arcadeId: Number(sessionStorage.getItem('arcade_id')),
            name: gameData.gameName,
            gameId: Number(gameData.gameId),
            price: gamePrice,
            isTimed: true,
            levels: 0,
            currentTime: date.toISOString(),
            played: false,
            playTime: timeInMins,
            paymentId: response.razorpay_payment_id,
          }
        };

        await axios.post(
          `${Constants.baseUrl}/${Constants.orderDetails}`,
          data
        );
        setKonamiCodes([]);
        // this only runs if the above succeeds
        // const result = await axios.post(
        //   `${Constants.baseUrl}/${Constants.gameStatus}`,
        //   data2
        // );

        // const konami = {
        //   gameName: gameData.gameName,
        //   gameId: gameData.gameId,
        //   konamiCode: result.data.Code,
        // };

        // setKonamiCodes((prev) => {
        //   const updated = [...prev, konami];
        //   localStorage.setItem("konamiCodes", JSON.stringify(updated));
        //   return updated;
        // });
      },
      theme: {
        color: "#FDD226",
      },
    };

    new (window as any).Razorpay(options).open();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="game-catalog-page">
      <div className="catalog-container">
        {Games.map((x) => (
          <div className="game-tile" key={x.GameId}>
            <GameTile
              gameId={x.GameId}
              gameName={x.Name}
              gameProfile={x.Thumbnail}
              pricesList={normalizePrices(x.Price)}
              infoMessage={
                x.Price.ByLevel
                  ? "Prices are based on levels. Please select."
                  : "Prices are based on time. Please select."
              }
              handleGamePayment={handleGamePayment}
            />
          </div>
        ))}
      </div>
        <Modal
      isOpen={showArcadeIdModal}
      onClose={() => setShowArcadeIdModal(false)}
      onSubmit={handleSubmit}
      title="Enter Arcade ID"
      children={"Arcade ID is missing. Please access the catalog through the arcade QR, or enter the arcade ID below to continue."}
      showInput={true}
    ></Modal>
      <KonamiCodeModal
        codes={konamiCodes}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      ></KonamiCodeModal>

      <FloatingActionButton
        onClick={handleOpenModal}
        count={konamiCodes.length}
      />
    </div>
  );
};

export default Catalog;
