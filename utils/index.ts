import { getAddress } from '@ethersproject/address'
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import Swal, {SweetAlertIcon} from 'sweetalert2';
import {Unit} from "web3-utils";
import {useEffect, useRef} from 'react';

export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


export function formatCoinAmount(amount: string, coinName: string = 'ether'): string {
    if(!amount){
      return "";
    }
    // @ts-ignore
    return web3.utils.fromWei(amount, coinName);
}

export function convertNumberToHex(amount: any): string {
    if (!Number.isInteger(amount)) {
        return web3.utils.toHex(amount.toString());
    }
    return web3.utils.numberToHex(amount)
}

export function hexToNumber(hex: string): string {
    // @ts-ignore
    return web3.utils.hexToNumber(hex)
}

export function formatPrecisionAmount(amount: any, precision: number = 18): string {
    const rawValue = new BigNumber(`${amount}`).toFixed(precision, BigNumber.ROUND_DOWN);
    return (amount && parseFloat(amount) !== Infinity) ? new BigNumber(rawValue).toFormat() : '0';
}

export function capitalizeFirstLetter(string) {

    if(string=="unapproved"){
        return "To be authroize"
    }else{
        return "Authorized"
    }
}

export function ethImgBackup(e: any) {
  let target: any = e.target;
  target.onerror = null;
  target.src="/static/images/eth.svg";
}

export function showSnackBar(text: string) {
  // Get the snackbar DIV
  var x: any = document.getElementById("snackbar");
  x.innerHTML = text
  // Add the "show" class to DIV
  x.className = "show";
  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

export function showMessage(type:SweetAlertIcon , title: string, text: string) {

        Swal.fire({
            icon: type,
            title: title,
            text: text,
            animation: false,
            showConfirmButton: false,
            showCloseButton: true,
        })

}

export function showPendingMessage(title: string = 'Trading package', text: string = 'The transaction can be viewed in the wallet'){

        Swal.fire({
            icon: 'info',
            iconHtml: '<img src="/static/images/spinner.gif" />',
            title: title,
            text: text,
            animation: false,
            showConfirmButton: false,
            showCloseButton: false,
            allowOutsideClick: false
        })
}
export function closeMessage(){
    Swal.close()
}
export function showRateBelow51(text:string, confirm :string){
    const content = `<span style="margin-bottom: 25px;display: block; color: white; font-size: 18px;">${text}</span>`;
    Swal.fire({
      width: '360px',
      showCloseButton: false,
      html: content,
      padding: '60px 15px 35px 15px',
      inputAttributes: {
        autocapitalize: 'off'
      },
      customClass: {
        title: 'title-white',
        content: 'text-red',
        confirmButton: 'button-pink'
      },
      confirmButtonText: confirm
    })
}

export function showAddOracle(addText: string, confirm :string, errText: string, showText: boolean, inputHolder: string, acallback: any){
  const content = showText? `
      <span style="color: #E03F3F; font-size: 16px;">${errText}</span>
    ` : undefined;
  
  Swal.fire({
    title: addText,
    showCloseButton: true,
    input: 'text',
    inputPlaceholder: inputHolder,
    width: '640px',
    html: content,
    padding: '20px 15px 35px 15px',
    inputAttributes: {
      autocapitalize: 'off'
    },
    customClass: {
      title: 'title-white',
      content: 'text-red',
      input: 'input-grey',
      confirmButton: 'button-pink'
    },
    confirmButtonText: confirm,
    // showLoaderOnConfirm: true,
    preConfirm: acallback,
    allowOutsideClick: () => !Swal.isLoading()
  })
}

export function getDecimalsToUnit (num:number) : Unit {
    switch (num) {
        case 3:
            return "kwei";
        case 6:
            return "mwei";
        case 9:
            return "gwei";
        case 18:
            return "ether";
        default:
            return "ether";
    }
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
