import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import { useOutletContext } from "react-router";
import NumberFlow from '@number-flow/react'



function Clock() {


    const [time, setTime] = useState("");
    const [ampm, setAmpm] = useState("");

    const { timeFormat } = useOutletContext();
    const { timeDisplay } = useOutletContext();

    const { textColor } = useOutletContext();
    const { showSeconds } = useOutletContext();

    const textColors = {
        white: "text-neutral-100",
        gold: "text-[#F4C95D]",
        coral: "text-[#FF7A90]",
        blue: "text-[#7DD3FC]",
        mint: "text-[#6EE7B7]",
        purple: "text-[#A78BFA]",
        peach: "text-[#FDBA74]",
        lime: "text-lime-300"
    };

    const textColors50 = {
        white: "text-neutral-100/60",
        gold: "text-[#F4C95D]/60",
        coral: "text-[#FF7A90]/60",
        blue: "text-[#7DD3FC]/60",
        mint: "text-[#6EE7B7]/60",
        purple: "text-[#A78BFA]/60",
        peach: "text-[#FDBA74]/60",
        lime: "text-lime-300/60"
    };



    useEffect(() => {
        const updateTime = () => {
        const now = new Date();
        const formatted = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: showSeconds ? "2-digit" : undefined,
            hour12: timeFormat
        });

        if (timeFormat) {
            const [hm, ap] = formatted.split(" ");
            setTime(hm);
            setAmpm(ap);
        } else {
            setTime(formatted);
            setAmpm("");
        }
    };

    updateTime(); // run once immediately
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timeFormat, showSeconds]);

    const [hoursStr, minutesStr, secondsStr] = time ? time.split(":") : ["0", "0", "0"];
    const hours = parseInt(hoursStr, 10) || 0;
    const minutes = parseInt(minutesStr, 10) || 0;
    const seconds = parseInt(secondsStr, 10) || 0;



  



  return (
    <div className='flex flex-col h-screen w-screen  justify-center px-2 bg-neutral-900 '>


        


        <div className='flex items-baseline-last justify-center  mb-10'>
            <div className={` break-all  p-10 flex  w-auto tabular-nums 
                ${timeDisplay ? "flex-row" : "flex-col items-center "} 
                 ${textColors[textColor] || "text-white"}
            `}
                 style={{ color: textColor?.startsWith('#') ? textColor : undefined }}
            > 
                
                <p className={` font-gothic leading-none  
                    ${showSeconds && timeDisplay ? " text-[37px] sm:text-[70px] md:text-[100px] lg:text-[150px] xl:text-[200px]" : " text-[57px] sm:text-[90px] md:text-[120px] lg:text-[200px] xl:text-[290px]"}
                `}><NumberFlow value={hours} format={{ minimumIntegerDigits: 2 }} className="tabular-nums" willChange isolate style={{ display: "inline-block", width: "2ch", textAlign: "center" }} />:</p>
                <p className={` font-gothic leading-none 
                    ${showSeconds && timeDisplay ? " text-[37px] sm:text-[70px] md:text-[100px] lg:text-[150px] xl:text-[200px]" : " text-[57px] sm:text-[90px] md:text-[120px] lg:text-[200px] xl:text-[290px]"}
                
                `}><NumberFlow value={minutes} format={{ minimumIntegerDigits: 2 }} className="tabular-nums" willChange isolate style={{ display: "inline-block", width: "2ch", textAlign: "center" }} /></p>
                {showSeconds && timeDisplay && (
                    <p className="font-gothic leading-none text-[37px] sm:text-[70px] md:text-[100px] lg:text-[150px] xl:text-[200px]">
                    :<NumberFlow value={seconds} format={{ minimumIntegerDigits: 2 }} className="tabular-nums" willChange isolate style={{ display: "inline-block", width: "2ch", textAlign: "center" }} />
                    </p>
                )}

            </div>

            {timeFormat && (
                <div className=' break-all   ' > 
                    <p 
                        className={`${textColors50[textColor] || "text-white/60"} font-gothic leading-none     ${timeDisplay ? "-ml-7 sm:-ml-0 md:-ml-3 lg:-ml-0" : "-ml-10 sm:-ml-30 md:-ml-15  "}  ${showSeconds ? "text-md sm:text-3xl" :"text-lg sm:text-3xl"} `}
                        style={{ color: textColor?.startsWith('#') ? textColor : undefined, opacity: textColor?.startsWith('#') ? 0.6 : undefined }}
                    >
                        {ampm}
                    </p>
                </div>
            )}
        </div>

        

    </div>
  )
}

export default Clock