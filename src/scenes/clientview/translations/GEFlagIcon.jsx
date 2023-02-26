import { SvgIcon } from "@mui/material";

function GEFlagIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 30 20"
        fill="#f00"
      >
        <title>Flag of Georgia</title>
        <path fill="#fff" d="m0 0h30v20H0z" />
        <path d="m13 0h4v20h-4zM0 8h30v4H0z" />
        <g id="c">
          <g id="b">
            <path
              id="a"
              d="m5.7968 1.954a5.4 5.4 0 0 0 1.4064 0 10.4 10.4 0 0 0 0 4.092 5.4 5.4 0 0 0-1.4064 0 10.4 10.4 0 0 0 0-4.092z"
            />
            <use transform="rotate(90,6.5,4)" xlinkHref="#a" />
          </g>
          <use x="17" xlinkHref="#b" />
        </g>
        <use y="12" xlinkHref="#c" />
      </svg>
    </SvgIcon>
  );
}

export default GEFlagIcon;
