"use client";

import React from "react";

export default function PinGate({ pinBuf, pinError, onPinPress }) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="gate" id="gate">
      <div className="gate-box">
        <div className="gate-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="gate-title">SUPER <span>ADMIN</span></div>
        <p className="gate-sub">Ingresa el PIN de administrador para continuar</p>
        
        <div className="pin-row" aria-label="Código PIN ingresado">
          <div className={`pin-dot ${pinBuf.length > 0 ? "filled" : ""}`} />
          <div className={`pin-dot ${pinBuf.length > 1 ? "filled" : ""}`} />
          <div className={`pin-dot ${pinBuf.length > 2 ? "filled" : ""}`} />
          <div className={`pin-dot ${pinBuf.length > 3 ? "filled" : ""}`} />
        </div>
        
        <p className="pin-err" role="alert">{pinError}</p>
        
        <div className="pin-grid">
          {digits.map((digit) => (
            <button 
              key={digit} 
              className="pin-btn" 
              onClick={() => onPinPress(digit)}
              type="button"
            >
              {digit}
            </button>
          ))}
          <button 
            className="pin-btn del" 
            onClick={() => onPinPress("del")}
            aria-label="Borrar dígito"
            type="button"
          >
            ⌫
          </button>
          <button 
            className="pin-btn" 
            onClick={() => onPinPress("0")}
            type="button"
          >
            0
          </button>
          <button 
            className="pin-btn" 
            onClick={() => onPinPress("ok")}
            type="button"
          >
            OK
          </button>
        </div>
        <p className="pin-hint">Demo PIN: <strong>2026</strong></p>
      </div>
    </div>
  );
}
