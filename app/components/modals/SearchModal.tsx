"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectvalue } from "../CountrySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../Calendar";
import Counter from "../Counter";


interface UpdatedQuery {
  [key: string]: string | number | undefined;
  locationValue?: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  startDate?: string;
  endDate?: string;
}
export default function SearchModal() {
  enum STEP {
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
  }
  const searchModal = useSearchModal();
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(STEP.LOCATION);
  const [roomCount, setRoomCount] = useState(1);
  const [guestCount, setGuestCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [location, setLocation] = useState<CountrySelectvalue>();
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, [step]);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, [step]);

 
  const onSubmit = useCallback(() => {
    if (step !== STEP.INFO) {
      return onNext();
    }
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    const updatedQuery: UpdatedQuery = {
      ...currentQuery ,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    setStep(STEP.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    location,
    roomCount,
    bathroomCount,
    onNext,
    params,
    router,
    dateRange,
    guestCount,
    STEP.INFO,
    STEP.LOCATION,
  ]);
  const actionLabel = useMemo(() => {
    if (step == STEP.INFO) {
      return "Search";
    }
    return "Next";
  }, [STEP.INFO, step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEP.LOCATION) {
      return undefined;
    }
    return "Back";
  }, [step, STEP.LOCATION]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="where do you want to go?"
        subtitle="Find the perfect location"
      />
      <CountrySelect
        value={location!}
        onChange={(value) => setLocation(value as CountrySelectvalue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );
  if (step == STEP.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          subtitle="Make sure everyone is free"
          title="When do you plan to go"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step == STEP.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More information" subtitle="Find your perfect place" />
        <Counter
          title="Guests"
          value={guestCount}
          subtitle="How many guests are coming?"
          onchange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Rooms"
          value={roomCount}
          subtitle="How many rooms do you need?"
          onchange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Bathrooms"
          value={bathroomCount}
          subtitle="How many bathrooms do you need?"
          onchange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }
  return (
    <Modal
      onOpen
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      secondaryActions={step == STEP.LOCATION ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
      title="Filters"
      actionlabel={actionLabel}
      body={bodyContent}
    />
  );
}
