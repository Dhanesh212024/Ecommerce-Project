

import React from "react";

export default function Convert(file){


    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No File Provided")
            return;
        }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = () => {
        console.error("FileReader error:", reader.error);
      };
      reader.onload = () => resolve(reader.result);
    });
 } ;


