import { useTheme } from "next-themes";

type Props = Readonly<React.SVGProps<SVGSVGElement>>;

export function SocketConnectionErrorIcon(props: Props) {
  const { theme } = useTheme();

  const stroke = theme === "dark" ? "#4A5059" : "#BABABA";
  const stroke2 = theme === "dark" ? "#2D333E" : "#BABABA";
  const fill = theme === "dark" ? "#272933" : "#F2F2F2";
  const fill2 = theme === "dark" ? "#4A5059" : "#CFCFCF";
  const fill3 = theme === "dark" ? "#4A5059" : "#D2D2D2";
  const fill4 = theme === "dark" ? "#2D333E" : "#FFFFFF";
  const fill5 = theme === "dark" ? "#4A5059" : "#BABABA";

  return (
    <svg
      width="119"
      height="105"
      viewBox="0 0 119 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M79.66 36.42C71.2899 36.42 62.77 36.08 54.7999 33.86C46.9799 31.69 39.7999 27.48 33.3999 22.61C29.2099 19.44 25.3999 16.92 19.9599 17.3C14.6335 17.5916 9.54234 19.5901 5.43995 23C-1.48005 29 -0.440053 40.23 2.32995 48.12C6.48995 60 19.1499 68.23 29.9099 73.61C42.34 79.82 56 83.42 69.6899 85.5C81.6899 87.32 97.1099 88.65 107.51 80.81C117.06 73.61 119.68 57.17 117.34 46.07C116.773 42.7879 115.027 39.8257 112.43 37.74C105.72 32.84 95.7099 36.11 88.1699 36.28C85.3699 36.34 82.52 36.41 79.66 36.42Z"
        fill={fill}
      />
      <path
        d="M59.18 104.95C79.4543 104.95 95.89 103.925 95.89 102.66C95.89 101.395 79.4543 100.37 59.18 100.37C38.9056 100.37 22.47 101.395 22.47 102.66C22.47 103.925 38.9056 104.95 59.18 104.95Z"
        fill={fill}
      />
      <path
        d="M6.54006 72.43C7.0813 72.43 7.52006 71.9912 7.52006 71.45C7.52006 70.9087 7.0813 70.47 6.54006 70.47C5.99882 70.47 5.56006 70.9087 5.56006 71.45C5.56006 71.9912 5.99882 72.43 6.54006 72.43Z"
        fill={fill2}
      />
      <path
        d="M48.78 84.86V89.17"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46.6299 87.02H50.9299"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M100.41 17.08H17.9401C15.8083 17.08 14.0801 18.8081 14.0801 20.94V77.51C14.0801 79.6418 15.8083 81.37 17.9401 81.37H100.41C102.542 81.37 104.27 79.6418 104.27 77.51V20.94C104.27 18.8081 102.542 17.08 100.41 17.08Z"
        fill={fill4}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M92.11 34.1801H26.23C24.7057 34.1801 23.47 35.4157 23.47 36.9401V72.8901C23.47 74.4144 24.7057 75.6501 26.23 75.6501H92.11C93.6343 75.6501 94.87 74.4144 94.87 72.8901V36.9401C94.87 35.4157 93.6343 34.1801 92.11 34.1801Z"
        fill={fill4}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M104.27 27.91V21C104.271 20.4923 104.173 19.9892 103.979 19.5198C103.786 19.0503 103.502 18.6236 103.143 18.2641C102.785 17.9046 102.359 17.6194 101.89 17.4248C101.421 17.2302 100.918 17.13 100.41 17.13H17.9401C17.4323 17.13 16.9296 17.2302 16.4606 17.4248C15.9916 17.6194 15.5657 17.9046 15.2071 18.2641C14.8486 18.6236 14.5644 19.0503 14.371 19.5198C14.1776 19.9892 14.0788 20.4923 14.0801 21V28L104.27 27.91Z"
        fill={fill3}
      />
      <path
        d="M41.1799 10.59V23.04"
        stroke={stroke2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M77.1799 10.59V23.04"
        stroke={stroke2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M90.5501 11.42C91.0913 11.42 91.5301 10.9812 91.5301 10.44C91.5301 9.89872 91.0913 9.45996 90.5501 9.45996C90.0088 9.45996 89.5701 9.89872 89.5701 10.44C89.5701 10.9812 90.0088 11.42 90.5501 11.42Z"
        fill={fill2}
      />
      <path
        d="M29.3101 12.2799C29.8513 12.2799 30.2901 11.8412 30.2901 11.2999C30.2901 10.7587 29.8513 10.3199 29.3101 10.3199C28.7688 10.3199 28.3301 10.7587 28.3301 11.2999C28.3301 11.8412 28.7688 12.2799 29.3101 12.2799Z"
        fill={fill2}
      />
      <path
        d="M54.3899 4.81006V9.11006"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52.24 6.95996H56.54"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.31006 0.930054V5.23005"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15991 3.07996H11.4699"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46.6699 64.16C47.3064 61.3198 48.8912 58.781 51.1632 56.9617C53.4353 55.1424 56.2592 54.1511 59.1699 54.1511C62.0806 54.1511 64.9045 55.1424 67.1766 56.9617C69.4487 58.781 71.0335 61.3198 71.6699 64.16"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M73.3 49.2401C74.2831 49.2401 75.08 48.4431 75.08 47.4601C75.08 46.477 74.2831 45.6801 73.3 45.6801C72.317 45.6801 71.52 46.477 71.52 47.4601C71.52 48.4431 72.317 49.2401 73.3 49.2401Z"
        fill={fill5}
      />
      <path
        d="M45.05 49.2401C46.0331 49.2401 46.83 48.4431 46.83 47.4601C46.83 46.477 46.0331 45.6801 45.05 45.6801C44.067 45.6801 43.27 46.477 43.27 47.4601C43.27 48.4431 44.067 49.2401 45.05 49.2401Z"
        fill={fill5}
      />
    </svg>
  );
}
