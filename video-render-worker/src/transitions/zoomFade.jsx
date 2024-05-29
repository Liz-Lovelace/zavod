import {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import type {
	TransitionPresentation,
	TransitionPresentationComponentProps,
} from '../types.js';

function FadePresentation({children, presentationDirection, presentationProgress, passedProps}) {
	const isEntering = presentationDirection === 'entering';
  /*
	const style = useMemo(() => {
		return {
			opacity: isEntering ? (presentationProgress) : 1,
			...(presentationDirection === 'entering'
				? passedProps.enterStyle
				: passedProps.exitStyle),
		};
	}, [
		isEntering,
		passedProps.enterStyle,
		passedProps.exitStyle,
		presentationDirection,
		presentationProgress,
	]);
  */

  const style = {
    opacity: isEntering ? presentationProgress : 1,
    transform: isEntering ? `scale(${2 - presentationProgress})` : `scale(${1 + presentationProgress})`,
  }

	return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export default function(props) {
	return {
		component: FadePresentation,
		props,
	};
};
