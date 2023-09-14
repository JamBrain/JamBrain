/** @deprecated */
export default function GridCol( props ) {
    let {flex = 1, flexGrow, flexShrink, flexBasis = 100} = props;

    flexGrow = (flexGrow != null) ? flexGrow : flex;
    flexShrink = (flexShrink != null) ? flexShrink : flex;

    let style = "flex: " + flexGrow + " " + flexShrink + "" + flexBasis + "%; max-width: " + flexBasis + "%;";

    return (
      <div class={`${props.class ?? ''} -col`} style={style} {...props}>
        {props.children}
      </div>
    );
  }
