import { LegacyRef, useCallback, useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserverを利用するためのカスタムフック。
 * 特定の要素がビューポートに入ったかどうかを監視し、その状態を管理する。
 * 主に無限スクロールや要素の遅延読み込みなどで使用される。
 * 詳細: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * @param {Object} options IntersectionObserverのオプションオブジェクト。
 *                         詳細: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#parameters
 * @return {[boolean, (function(*): void)]} [要素がビューポートに入っているかのフラグ, 監視する要素を設定する関数]
 */
export const useIntersection = (options = {}): [boolean, LegacyRef<HTMLDivElement>] => {
  // 要素がビューポート内に入っているかどうかを表す状態
  const [isIntersecting, setIsIntersecting] = useState(false);

  // refTriggerは監視の再初期化をトリガーするための値
  const [refTrigger, setRefTrigger] = useState(0);

  // 監視対象の要素を保持するref
  const ref = useRef<HTMLElement | null>(null);

  // refに渡すコールバック関数。新しい要素が指定されるたびに実行される。
  const callbackRef = useCallback((element: HTMLElement) => {
    if (element) {
      ref.current = element; // 新しい要素をrefに設定
      setIsIntersecting(false); // 状態を初期化
      setRefTrigger(Date.now()); // 再初期化用のトリガーを更新（現在時刻を記録）
    }
  }, []);

  // refTriggerまたは監視対象要素が変化するたびにIntersectionObserverを再設定する。
  useEffect(() => {
    // refTriggerが設定され、かつ監視対象の要素が存在する場合のみ実行
    if (refTrigger && ref.current) {
      const observer = new IntersectionObserver(([entry], observer) => {
        // ビューポート内に要素が入った場合の処理
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target); // 一度だけ監視するために監視解除
        } else {
          // ビューポート内から要素が出た場合の処理
          setIsIntersecting(false);
        }
      }, options);

      // 監視を開始
      observer.observe(ref.current);

      // コンポーネントのアンマウント時に監視を解除
      return () => observer.disconnect();
    }
  }, [options, refTrigger]);

  return [isIntersecting, callbackRef as LegacyRef<HTMLDivElement>];
};
