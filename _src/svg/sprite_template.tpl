.icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
    position: relative;
    transition: fill $animationTime $animationFunc;
}

{{#shapes}}
.icon_{{base}} {
    height: {{height.inner}}px;
    width: {{width.inner}}px;
}
{{/shapes}}