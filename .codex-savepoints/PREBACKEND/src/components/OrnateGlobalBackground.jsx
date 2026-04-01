import React from 'react';
import './OrnateGlobalBackground.css';

export default function OrnateGlobalBackground() {
  return (
    <div className="ornate-global-bg" aria-hidden="true">
      <div className="ornate-layer ornate-layer-base" />

      <div className="ornate-layer ornate-layer-washes">
        <img src="/bg/wash-right.png" alt="" className="ornate-wash ornate-wash-right" />
        <img src="/bg/wash-left.png" alt="" className="ornate-wash ornate-wash-left" />
      </div>

      <div className="ornate-layer ornate-layer-lineart">
        <img src="/bg/rome-lineart-left.svg" alt="" className="ornate-lineart ornate-lineart-left" />
        <img src="/bg/rome-lineart-right.svg" alt="" className="ornate-lineart ornate-lineart-right" />
      </div>

      <div className="ornate-layer ornate-layer-tuktuk">
        <img src="/bg/tuktuk-ghost.svg" alt="" className="ornate-tuktuk ornate-tuktuk-ghost ornate-tuktuk-ghost-1" />
        <img src="/bg/tuktuk-ghost.svg" alt="" className="ornate-tuktuk ornate-tuktuk-ghost ornate-tuktuk-ghost-2" />
        <img src="/bg/tuktuk-color.webp" alt="" className="ornate-tuktuk ornate-tuktuk-color ornate-tuktuk-color-1" />
        <img src="/bg/tuktuk-color.webp" alt="" className="ornate-tuktuk ornate-tuktuk-color ornate-tuktuk-color-2" />
      </div>

      <div className="ornate-layer ornate-layer-frame">
        <img src="/bg/frame-gold.svg" alt="" className="ornate-frame" />
      </div>
    </div>
  );
}

