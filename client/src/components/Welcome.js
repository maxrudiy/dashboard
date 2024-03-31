import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentAccessToken } from "../store/auth-slice";
import { Link } from "react-router-dom";
import {
  useGetParameterQuery,
  useGetMonitoringParametersQuery,
  useSetParameterMutation,
  useCreateSystemMutation,
} from "../api/s321-api-slice";

import React, { useEffect, useState } from "react";

function Welcome() {
  const [value, setValue] = useState({ parameter: "", value: "", system: "" });
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectCurrentAccessToken);

  const { data, isFetching, isLoading } = useGetMonitoringParametersQuery({ system: "v9" }, { pollingInterval: 5000 });
  const frequency = parseInt(data?.frequency.response.substring(6, 10), 16) / 100;
  const voltage = parseInt(data?.voltage.response.substring(6, 10), 16);
  const current = parseInt(data?.current.response.substring(6, 10), 16) / 100;
  const rpm = data?.rpm.response.substring(6, 10);
  const cosPhi = data?.motor.cosPhi;
  const name = data?.motor.name;
  const ratedPower = data?.motor.power;
  const ratedVoltage = data?.motor.voltage;
  const ratedCurrent = data?.motor.current;
  const ratedRpm = data?.motor.rpm;
  const ratedFrequency = data?.motor.frequency;

  const welcome = user ? `Welcome ${user.email}!` : "Welcome!";
  const tokenAbbr = `${accessToken.slice(0, 9)}...`;

  const [setParameter, { isSuccess }] = useSetParameterMutation();
  const handleSetParameter = () => {
    setParameter({ parameter: value.parameter, value: value.value, system: value.system });
  };
  const content = (
    <>
      <p>{name}</p>
      <p>
        Frequency: {frequency}/{ratedFrequency} Hz
      </p>
      <p>
        Voltage: {voltage}/{ratedVoltage} V
      </p>
      <p>
        Current: {current}/{ratedCurrent} A
      </p>
      <p>
        RPM: {rpm}/{ratedRpm}
      </p>
      <p>
        Power: {Math.round(1.73 * voltage * current * cosPhi)}/{ratedPower} W
      </p>
      Parameter
      <input type="text" onChange={(e) => setValue({ ...value, parameter: e.target.value })} />
      Value
      <input type="text" onChange={(e) => setValue({ ...value, value: e.target.value + "00" })} />
      System
      <input type="text" onChange={(e) => setValue({ ...value, system: e.target.value })} />
      <button onClick={handleSetParameter}>SetValue</button>
      <h1>{welcome}</h1>
      <p>Token: {tokenAbbr}</p>
    </>
  );
  return content;
}

export default Welcome;
